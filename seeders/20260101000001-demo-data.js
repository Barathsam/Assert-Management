'use strict';

/**
 * Demo data.
 *
 * Assets are not just INSERTed with a status — each one is walked through a real lifecycle
 * (purchase → issue → return → repair → scrap), writing the same ledger rows the application
 * writes. That matters: if the seed inserted `status = 'ISSUED'` directly with no matching
 * ISSUE row, the history pages would be empty, the utilisation figures would be zero, and
 * /reports/integrity would light up red on a fresh database.
 *
 * Deterministic (seeded PRNG, fixed base date) so the demo looks the same every time.
 */

const BRANCHES = [
  { code: 'BLR', name: 'Bangalore HQ', city: 'Bangalore', state: 'Karnataka' },
  { code: 'MUM', name: 'Mumbai Office', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'DEL', name: 'Delhi Office', city: 'New Delhi', state: 'Delhi' },
  { code: 'CHN', name: 'Chennai Plant', city: 'Chennai', state: 'Tamil Nadu' },
];

const CATEGORIES = [
  { code: 'LAP', name: 'Laptop', description: 'Portable computers issued to staff' },
  { code: 'MOB', name: 'Mobile Phone', description: 'Company-issued handsets' },
  { code: 'MDM', name: 'Modem', description: 'Routers, dongles and network gear' },
  { code: 'MON', name: 'Monitor', description: 'External displays' },
  { code: 'PRN', name: 'Printer', description: 'Desk and floor printers' },
  { code: 'DRL', name: 'Drill Machine', description: 'Power tools' },
  { code: 'SCR', name: 'Screw Driver', description: 'Hand tools' },
  { code: 'TST', name: 'Testing Kit', description: 'Field diagnostic equipment' },
];

/** [category code, make, model, spec, cost] */
const CATALOGUE = [
  ['LAP', 'Dell', 'Latitude 5420', 'i5 / 16GB / 512GB', 82000],
  ['LAP', 'Dell', 'Latitude 7440', 'i7 / 16GB / 1TB', 105000],
  ['LAP', 'Lenovo', 'ThinkPad E14', 'i5 / 8GB / 256GB', 64000],
  ['LAP', 'HP', 'EliteBook 840', 'i7 / 16GB / 512GB', 98000],
  ['LAP', 'Apple', 'MacBook Air M2', '8GB / 256GB', 114000],
  ['MOB', 'Samsung', 'Galaxy M14', '4GB / 128GB', 13500],
  ['MOB', 'Apple', 'iPhone 13', '128GB', 59900],
  ['MOB', 'Xiaomi', 'Redmi Note 12', '6GB / 128GB', 16500],
  ['MDM', 'TP-Link', 'Archer C6', 'AC1200 dual band', 3200],
  ['MDM', 'JioFi', 'JMR815', '4G hotspot', 1800],
  ['MON', 'Dell', 'P2422H', '24" IPS', 14500],
  ['MON', 'LG', '24MK600M', '24" FHD', 11800],
  ['PRN', 'HP', 'LaserJet M126', 'Mono multifunction', 18500],
  ['PRN', 'Canon', 'imageCLASS LBP', 'Mono laser', 21000],
  ['DRL', 'Bosch', 'GSB 500 RE', '500W impact drill', 4200],
  ['DRL', 'Makita', 'HP1630', '710W hammer drill', 6800],
  ['SCR', 'Stanley', 'STMT78070', '46-piece set', 1900],
  ['SCR', 'Taparia', '840', 'Insulated set', 850],
  ['TST', 'Fluke', '117', 'Digital multimeter', 24500],
  ['TST', 'Megger', 'MIT300', 'Insulation tester', 32000],
];

const FIRST = [
  'Priya',
  'Rahul',
  'Anita',
  'Vikram',
  'Sneha',
  'Arjun',
  'Divya',
  'Karthik',
  'Meera',
  'Rohan',
  'Kavya',
  'Suresh',
  'Nisha',
  'Aditya',
  'Pooja',
  'Manoj',
  'Lakshmi',
  'Sanjay',
  'Deepa',
  'Vivek',
  'Ritu',
  'Ganesh',
  'Swathi',
  'Naveen',
  'Anjali',
  'Prakash',
  'Shruti',
  'Kiran',
  'Neha',
  'Ramesh',
];
const LAST = [
  'Sharma',
  'Verma',
  'Rao',
  'Nair',
  'Iyer',
  'Patel',
  'Reddy',
  'Gupta',
  'Menon',
  'Desai',
  'Kulkarni',
  'Joshi',
  'Pillai',
  'Shetty',
  'Kapoor',
  'Bose',
  'Chauhan',
  'Mishra',
  'Naidu',
  'Das',
];
const DESIGNATIONS = [
  ['Senior Engineer', 'Engineering'],
  ['QA Engineer', 'Engineering'],
  ['Field Technician', 'Operations'],
  ['Service Manager', 'Operations'],
  ['Accountant', 'Finance'],
  ['HR Executive', 'People'],
  ['Sales Executive', 'Sales'],
  ['Support Engineer', 'Support'],
];

const RETURN_REASONS = [
  'UPGRADE',
  'RESIGNATION',
  'PROJECT_END',
  'NOT_REQUIRED',
  'REPAIR',
  'DAMAGED',
];
const VENDORS = ['Redington', 'Ingram Micro', 'Compuage', 'Savex', 'Rashi Peripherals'];
const REPAIR_VENDORS = ['Acme Services', 'TechCare Solutions', 'QuickFix IT'];

/** Deterministic PRNG (mulberry32) so every `db:seed` produces the same demo. */
function rng(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const BASE = new Date('2026-07-13T00:00:00Z'); // "today" for the demo
const day = 86400000;
const addDays = (d, n) => new Date(d.getTime() + n * day);
const iso = (d) => d.toISOString();
const isoDate = (d) => d.toISOString().slice(0, 10);

module.exports = {
  async up(queryInterface) {
    const rand = rng(42);
    const pick = (arr) => arr[Math.floor(rand() * arr.length)];
    const int = (lo, hi) => lo + Math.floor(rand() * (hi - lo + 1));

    const q = (sql, replacements) =>
      queryInterface.sequelize.query(sql, { replacements, type: 'SELECT' });

    /* ---------------------------------------------------------------- masters */

    for (const b of BRANCHES) {
      await q(
        `INSERT INTO branches (code, name, city, state) VALUES (:code, :name, :city, :state)`,
        b,
      );
    }
    for (const c of CATEGORIES) {
      await q(
        `INSERT INTO asset_categories (code, name, description)
         VALUES (:code, :name, :description)`,
        c,
      );
    }

    const branches = await q(`SELECT id, code FROM branches ORDER BY id`);
    const categories = await q(`SELECT id, code FROM asset_categories ORDER BY id`);
    const branchByCode = Object.fromEntries(branches.map((b) => [b.code, b.id]));
    const catByCode = Object.fromEntries(categories.map((c) => [c.code, c.id]));

    /* -------------------------------------------------------------- employees */

    const employees = [];
    for (let i = 1; i <= 30; i++) {
      const first = FIRST[(i - 1) % FIRST.length];
      const last = LAST[int(0, LAST.length - 1)];
      const [designation, department] = DESIGNATIONS[int(0, DESIGNATIONS.length - 1)];
      const branchId = branchByCode[pick(BRANCHES).code];
      const code = `EMP${String(i).padStart(4, '0')}`;

      const [row] = await q(
        `INSERT INTO employees
           (employee_code, first_name, last_name, email, phone, designation, department,
            branch_id, date_of_joining, is_active)
         VALUES (:code, :first, :last, :email, :phone, :designation, :department,
                 :branchId, :doj, true)
         RETURNING id`,
        {
          code,
          first,
          last,
          email: `${first.toLowerCase()}.${last.toLowerCase()}${i}@ktt.example`,
          phone: `98${int(10000000, 99999999)}`,
          designation,
          department,
          branchId,
          doj: isoDate(addDays(BASE, -int(200, 1800))),
        },
      );
      employees.push({ id: row.id, branchId, active: true });
    }

    /* ------------------------------------------------------------------ assets */

    // Every state change goes through this, so the ledger stays contiguous: each row's
    // from_status is the previous row's to_status, exactly as applyTransition() guarantees at
    // runtime. /reports/integrity is therefore green on a freshly seeded database.
    const event = async (assetId, type, at, fromStatus, toStatus, extra = {}) => {
      await q(
        `INSERT INTO asset_transactions
           (asset_id, txn_type, txn_at, from_status, to_status, employee_id, branch_id,
            return_reason, amount, vendor, remarks, performed_by)
         VALUES (:assetId, :type, :at, :fromStatus, :toStatus, :employeeId, :branchId,
                 :returnReason, :amount, :vendor, :remarks, 'seed')`,
        {
          assetId,
          type,
          at: iso(at),
          fromStatus,
          toStatus,
          employeeId: extra.employeeId ?? null,
          branchId: extra.branchId,
          returnReason: extra.returnReason ?? null,
          amount: extra.amount ?? null,
          vendor: extra.vendor ?? null,
          remarks: extra.remarks ?? null,
        },
      );
    };

    for (let i = 0; i < 80; i++) {
      const [catCode, make, model, spec, baseCost] = CATALOGUE[i % CATALOGUE.length];
      const categoryId = catByCode[catCode];
      const branch = pick(BRANCHES);
      const branchId = branchByCode[branch.code];

      const purchasedAt = addDays(BASE, -int(120, 1100));
      const cost = Math.round(baseCost * (0.92 + rand() * 0.16));
      const vendor = pick(VENDORS);

      const [assetRow] = await q(
        `INSERT INTO assets
           (asset_tag, serial_number, category_id, branch_id, make, model, specification,
            status, purchase_date, purchase_cost, vendor, invoice_no, warranty_expiry)
         VALUES (
           (SELECT code FROM asset_categories WHERE id = :categoryId) || '-' ||
           (SELECT code FROM branches WHERE id = :branchId) || '-' ||
           lpad(nextval('asset_tag_seq')::text, 6, '0'),
           :serial, :categoryId, :branchId, :make, :model, :spec,
           'IN_STOCK', :purchaseDate, :cost, :vendor, :invoiceNo, :warranty
         )
         RETURNING id`,
        {
          categoryId,
          branchId,
          serial: `${catCode}${String(100000 + i * 7919).slice(0, 6)}${String.fromCharCode(65 + (i % 26))}${int(100, 999)}`,
          make,
          model,
          spec,
          purchaseDate: isoDate(purchasedAt),
          cost,
          vendor,
          invoiceNo: `INV/${purchasedAt.getUTCFullYear()}/${1000 + i}`,
          warranty: isoDate(addDays(purchasedAt, 1095)),
        },
      );
      const assetId = assetRow.id;

      await event(assetId, 'PURCHASE', purchasedAt, null, 'IN_STOCK', {
        branchId,
        amount: cost,
        vendor,
        remarks: `Invoice INV/${purchasedAt.getUTCFullYear()}/${1000 + i}`,
      });

      // Walk a plausible life: a few issue/return cycles, sometimes a repair, sometimes a scrap.
      let status = 'IN_STOCK';
      let holderId = null;
      let cursor = addDays(purchasedAt, int(3, 40));
      const cycles = int(0, 3);

      for (let c = 0; c < cycles && cursor < BASE; c++) {
        if (status !== 'IN_STOCK') break;

        const employee = employees[int(0, employees.length - 1)];
        await event(assetId, 'ISSUE', cursor, 'IN_STOCK', 'ISSUED', {
          branchId,
          employeeId: employee.id,
        });
        status = 'ISSUED';
        holderId = employee.id;

        const heldFor = int(40, 400);
        const returnAt = addDays(cursor, heldFor);
        if (returnAt >= BASE) break; // still holding it today

        const reason = pick(RETURN_REASONS);
        const toStatus = reason === 'REPAIR' || reason === 'DAMAGED' ? 'IN_REPAIR' : 'IN_STOCK';
        await event(assetId, 'RETURN', returnAt, 'ISSUED', toStatus, {
          branchId,
          employeeId: employee.id,
          returnReason: reason,
        });
        status = toStatus;
        holderId = null;
        cursor = returnAt;

        if (status === 'IN_REPAIR') {
          const repairedAt = addDays(cursor, int(4, 21));
          if (repairedAt >= BASE) break; // still in the workshop today
          const repairCost = Math.round(cost * (0.03 + rand() * 0.09));
          await event(assetId, 'REPAIR_COMPLETE', repairedAt, 'IN_REPAIR', 'IN_STOCK', {
            branchId,
            amount: repairCost,
            vendor: pick(REPAIR_VENDORS),
            remarks: 'Serviced and tested',
          });
          status = 'IN_STOCK';
          cursor = addDays(repairedAt, int(2, 30));
        } else {
          cursor = addDays(cursor, int(2, 45));
        }
      }

      // Leave roughly one in ten sitting in the workshop right now, so IN_REPAIR is actually
      // represented on the demo screens — it is the state that keeps a faulty asset out of
      // Stock View, and a demo where nothing is ever in repair never shows that working.
      if (status === 'IN_STOCK' && rand() < 0.1) {
        const sentAt = addDays(BASE, -int(2, 25));
        if (sentAt > cursor) {
          await event(assetId, 'SEND_TO_REPAIR', sentAt, 'IN_STOCK', 'IN_REPAIR', {
            branchId,
            vendor: pick(REPAIR_VENDORS),
            remarks: 'Faulty on inspection',
          });
          status = 'IN_REPAIR';
          cursor = sentAt;
        }
      }

      // Retire roughly one in eight — old enough to be plausible, and only from a state that
      // legally allows it (never straight from ISSUED).
      const scrappable = status === 'IN_STOCK' || status === 'IN_REPAIR';
      if (scrappable && rand() < 0.12 && cursor < BASE) {
        const scrappedAt = addDays(cursor, int(5, 60));
        if (scrappedAt < BASE) {
          const scrapValue = Math.round(cost * (0.02 + rand() * 0.06));
          await event(assetId, 'SCRAP', scrappedAt, status, 'SCRAPPED', {
            branchId,
            amount: scrapValue,
            vendor: 'eWaste Kart',
            remarks: 'Beyond economic repair',
          });
          await q(
            `UPDATE assets
                SET status = 'SCRAPPED', scrapped_at = :at, scrap_value = :value,
                    scrap_reason = 'Beyond economic repair', current_holder_id = NULL
              WHERE id = :assetId`,
            { assetId, at: iso(scrappedAt), value: scrapValue },
          );
          continue;
        }
      }

      await q(
        `UPDATE assets SET status = :status, current_holder_id = :holderId WHERE id = :assetId`,
        {
          assetId,
          status,
          holderId,
        },
      );
    }

    /* --------------------------------------------------------------------------
     * Deactivate a few employees — but only ones holding nothing, because that is the rule the
     * app enforces at runtime. Seeding a deactivated employee who still holds a laptop would
     * put the database in a state the application itself would refuse to create.
     * ------------------------------------------------------------------------ */
    await q(
      `UPDATE employees
          SET is_active = false, date_of_exit = :exit
        WHERE id IN (
          SELECT e.id FROM employees e
           WHERE NOT EXISTS (
             SELECT 1 FROM assets a
              WHERE a.current_holder_id = e.id AND a.status = 'ISSUED'
           )
           ORDER BY e.id DESC
           LIMIT 4
        )`,
      { exit: isoDate(addDays(BASE, -int(20, 200))) },
    );
  },

  async down(queryInterface) {
    // The ledger is append-only and a trigger enforces it, so even this teardown cannot delete
    // from it without explicitly standing the trigger down first. That is the guarantee working
    // as intended: wiping history has to be a deliberate act, not an accident.
    //
    // Order matters below — every FK is ON DELETE RESTRICT, so children go first.
    await queryInterface.sequelize.query(`
      ALTER TABLE asset_transactions DISABLE TRIGGER asset_transactions_no_update_delete;
      DELETE FROM asset_transactions;
      ALTER TABLE asset_transactions ENABLE TRIGGER asset_transactions_no_update_delete;
      DELETE FROM assets;
      DELETE FROM employees;
      DELETE FROM asset_categories;
      DELETE FROM branches;
      ALTER SEQUENCE asset_tag_seq RESTART WITH 1;
    `);
  },
};
