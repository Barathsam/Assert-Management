# Asset Management System

Tracks a company's tangible assets — laptops, phones, modems, tools — from purchase, through the
employees who use them, to the day they are scrapped.

---

## Running it

```bash
docker compose up --build
```

Then open **http://localhost:3000**. That's it — Postgres starts, migrations run, and ~80 assets
with a couple of years of backdated history are seeded, so every page has real data on first load.

<details>
<summary>Running against a local Postgres instead</summary>

```bash
cp .env.example .env          # point DB_* at your Postgres
npm install
npm run db:migrate
npm run db:seed
npm run dev                   # http://localhost:3000
```

</details>

| Command                           |                          |
| --------------------------------- | ------------------------ |
| `npm run dev`                     | dev server with reload   |
| `npm run build` / `npm start`     | compile and run          |
| `npm run typecheck`               | TypeScript, strict       |
| `npm run lint` / `npm run format` | ESLint / Prettier        |
| `npm run db:reset`                | drop, migrate, reseed    |
| `./scripts/verify.sh`             | end-to-end check (below) |

### `./scripts/verify.sh`

Drives the whole lifecycle through the real HTTP endpoints — purchase → issue → return for repair →
repair complete → scrap — then tries to break every rule the app claims to enforce (double-issue,
duplicate serial in a different case, deactivating someone who still holds a laptop, doing anything
at all to a scrapped asset), and finally checks that no asset's `status` has drifted from its ledger.

It writes to the database, so run it against the demo stack only. `npm run db:reset` restores clean
data afterwards.

---

## Stack

Exactly the stack the task specifies — Node.js (Express), PostgreSQL, Sequelize ORM, Jade/Pug,
Bootstrap, CSS, DataTables.net — written in **TypeScript**, with **ESLint** and **Prettier**.

Bootstrap, DataTables and jQuery are installed from npm and served by `express.static`. There is no
CDN dependency and no frontend bundler: the only client-side JavaScript is DataTables setup and two
Bootstrap behaviours, so there is no module graph worth bundling.

---

## The requirements, and where they live

| #   | Requirement                                                                                             | Where                  |
| --- | ------------------------------------------------------------------------------------------------------- | ---------------------- |
| 1   | Employee Master — add/edit/view, active/inactive filter, search                                         | `/employees`           |
| 2   | Asset Master — add/edit/view, filter by type, search make/model, identified by serial **and** unique id | `/assets`              |
| 3   | Asset Category Master                                                                                   | `/categories`          |
| 4   | Stock View — totals by branch, total value in footer                                                    | `/stock`               |
| 5   | Issue Asset                                                                                             | `/issue`               |
| 6   | Return Asset, capturing the reason                                                                      | `/return`              |
| 7   | Scrap Asset — then invisible everywhere except reports                                                  | `/scrap`               |
| 8   | Asset History — purchase to scrap, and what the money bought                                            | `/reports/history/:id` |

Two additions the spec implies but never names: a **Branch master** (requirement 4 groups by branch,
but nothing defined one) and an **IN_REPAIR** state (see below).

---

## How it's built

Five tables, one view.

```
branches ──┬── employees ───┐
           │                │ current_holder_id
           └── assets ──────┘
                 │  status, current_holder_id     ← where the asset is NOW
                 │
                 └── asset_transactions           ← everything that ever happened
asset_categories ── assets

assets_active  =  VIEW: assets WHERE status <> 'SCRAPPED'
```

`assets` holds current state. `asset_transactions` is an append-only ledger — one row per lifecycle
event, each carrying `from_status`, `to_status`, and an `amount` (purchase cost, repair bill, or
scrap value). That ledger **is** requirement 8.

Nothing stores the same fact twice. Every state change writes exactly two things in one transaction:
update the asset row, append the ledger row.

### One function owns `assets.status`

`src/services/assetLifecycle.ts` is the only code permitted to write it. Controllers call
`issueAsset()`, `returnAsset()`, `scrapAsset()` — they never touch the column. And every rule that
function enforces is **also** enforced by a Postgres constraint, so correctness doesn't depend on
future code remembering the rules:

```sql
CHECK ((status = 'ISSUED')   = (current_holder_id IS NOT NULL))  -- no "issued to nobody"
CHECK ((status = 'SCRAPPED') = (scrapped_at IS NOT NULL))        -- no "scrapped, no date"
CHECK (txn_type <> 'RETURN' OR return_reason IS NOT NULL)        -- req 6: reason is mandatory
CREATE UNIQUE INDEX ON assets (upper(btrim(serial_number)));     -- 'abc1' and ' ABC1 ' collide
CREATE TRIGGER ... BEFORE UPDATE OR DELETE ON asset_transactions -- history cannot be rewritten
```

### The state machine

```
          ┌──── issue ────► ISSUED ──── return (upgrade/resignation/…) ────┐
          │                    │                                            │
    IN_STOCK ◄────────────────┼────────────────────────────────────────────┘
       │  ▲                    │
       │  │ repair complete    └── return (repair/damaged) ──► IN_REPAIR
       │  └──────────────────────────────────────────────────────┘
       │
       └──── scrap ────► SCRAPPED   (terminal)
```

---

## Four decisions worth explaining

**1. `IN_REPAIR` exists, and returning something broken does not put it back in stock.**

The spec asks Return to capture a reason, and lists _repair_ as one. With only three states, a laptop
returned with a dead keyboard lands straight back in Stock View — which the spec defines as assets
_"ready to give to any employee."_ It is not ready to give to anyone, and sooner or later someone
issues it. Worse, the repair bill has nowhere to live, so it vanishes from what the asset cost.

So `REPAIR` and `DAMAGED` send the asset to `IN_REPAIR`; a _Repair Complete_ action captures the cost
and vendor and puts it back in stock. Stock View stays honest, and the repair spend shows up in the
asset's total cost of ownership.

**2. Scrapped assets are hidden by a database view, not a Sequelize scope.**

Requirement 7 is a _negative_ requirement: scrapped assets must appear on **no** page except reports.
Negative requirements rot — they hold on the day you ship and break the first time someone adds a page.

The obvious tool, Sequelize's `defaultScope`, is a trap. It applies to `Asset.findAll()` but is
**silently ignored when Asset appears inside an `include`** — `Employee.findAll({ include: [Asset] })`
would cheerfully return scrapped assets, and the bug would look like working code.

So it's enforced in Postgres. `assets_active` is a view over the non-scrapped rows, and there are two
models: `ActiveAsset` (the view) for every operational page and join, and `Asset` (the table) for
reports, the history page, and the scrap transition itself. **A new page cannot leak a scrapped asset,
because the model it reaches for cannot see one.**

**3. You cannot deactivate an employee who is still holding assets.**

The moment someone resigns is precisely and only the moment the company gets its property back. An app
that lets you tick "inactive" while they walk out with a laptop has failed at its one job. So it's a
hard block — but not a dead end: their page lists what they hold, each with a Return button
pre-filled with `reason=RESIGNATION`.

**4. You cannot scrap an asset that's still issued — but you don't have to do it in two steps.**

Scrapping in place would strand the holding open and destroy the record of who had the asset last and
in what condition, which is exactly what you most need to know when writing off ₹82,000 of hardware.
So `ISSUED → SCRAPPED` isn't a legal transition. Instead, the Scrap page — opened on an issued asset —
also shows the return fields, and one submit writes **both** ledger rows (`RETURN` then `SCRAP`) in a
single transaction. Clean model underneath, one click on top.

---

## Things that would otherwise have been bugs

- **Double-issue.** The status is re-checked _after_ `SELECT … FOR UPDATE` takes the row lock, not
  before. Checking first and acting second is the classic race: two people click Issue, both read
  `IN_STOCK`, both proceed. Here the second request blocks, wakes, re-reads `ISSUED`, and is rejected
  naming the current holder. (Structurally it's impossible anyway — the holder is one column on one
  row, so there is nowhere to write a second one.)
- **Duplicate serials.** The unique index is functional — `upper(btrim(serial_number))` — because a
  plain `UNIQUE` lets `abc123` and `ABC123` coexist, which is exactly how duplicate serials get into
  real inventories. And the app doesn't pre-check with a `SELECT`: two concurrent creates would both
  pass that check. It lets the index decide and turns the error into a form message.
- **Money.** Sequelize returns `DECIMAL` as a **string**. `rows.reduce((a, r) => a + r.purchaseCost, 0)`
  yields `"0820004500"` — string concatenation, silently, with no error. Every total in the app is
  summed in SQL.
- **Backdated events.** A return dated before its issue produces a negative holding interval and
  quietly corrupts every utilisation figure. Rejected at the transition.

## `/reports/integrity`

`assets.status` is a cached copy of where the ledger says an asset ended up. This page lists any asset
where the two disagree — it should always be empty, and it is a one-query proof that the denormalised
column hasn't drifted from the history. If it ever disagrees, the ledger is right.

---

## Layout

```
migrations/          schema: enums, tables, CHECKs, the append-only trigger, assets_active
seeders/             ~80 assets walked through real lifecycles, so history/metrics aren't empty
src/
  models/            Branch, Employee, AssetCategory, Asset, ActiveAsset, AssetTransaction
  services/
    assetLifecycle   the state machine — the ONLY writer of assets.status
    metrics          history totals, holding intervals (LEAD over the ledger), stock aggregation
  routes/            masters · assets · transactions · stock · reports · api
  views/             Pug + Bootstrap + DataTables
```
