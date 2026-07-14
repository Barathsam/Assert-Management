'use strict';

/**
 * Initial schema.
 *
 * Written as raw SQL rather than queryInterface calls because the guarantees this
 * app makes are database constraints, and several of them (functional unique index,
 * CHECK constraints, the append-only trigger, the assets_active view) have no
 * queryInterface equivalent. Keeping the whole schema in one SQL block means the
 * constraints sit next to the columns they constrain, instead of being scattered.
 */
module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(`
      CREATE TYPE asset_status AS ENUM ('IN_STOCK', 'ISSUED', 'IN_REPAIR', 'SCRAPPED');

      CREATE TYPE txn_type AS ENUM (
        'PURCHASE', 'ISSUE', 'RETURN', 'SEND_TO_REPAIR', 'REPAIR_COMPLETE', 'SCRAP'
      );

      CREATE TYPE return_reason AS ENUM (
        'UPGRADE', 'REPAIR', 'DAMAGED', 'RESIGNATION', 'PROJECT_END', 'NOT_REQUIRED', 'OTHER'
      );

      -- ---------------------------------------------------------------- branches
      CREATE TABLE branches (
        id          serial PRIMARY KEY,
        code        varchar(8)   NOT NULL UNIQUE,
        name        varchar(120) NOT NULL,
        city        varchar(80),
        state       varchar(80),
        is_active   boolean      NOT NULL DEFAULT true,
        created_at  timestamptz  NOT NULL DEFAULT now(),
        updated_at  timestamptz  NOT NULL DEFAULT now()
      );

      -- -------------------------------------------------------- asset_categories
      CREATE TABLE asset_categories (
        id          serial PRIMARY KEY,
        code        varchar(8)  NOT NULL UNIQUE,
        name        varchar(80) NOT NULL UNIQUE,
        description text,
        is_active   boolean     NOT NULL DEFAULT true,
        created_at  timestamptz NOT NULL DEFAULT now(),
        updated_at  timestamptz NOT NULL DEFAULT now()
      );

      -- --------------------------------------------------------------- employees
      CREATE TABLE employees (
        id              serial PRIMARY KEY,
        employee_code   varchar(32)  NOT NULL UNIQUE,
        first_name      varchar(80)  NOT NULL,
        last_name       varchar(80)  NOT NULL,
        email           varchar(160) UNIQUE,
        phone           varchar(20),
        designation     varchar(80),
        department      varchar(80),
        branch_id       integer      NOT NULL REFERENCES branches (id) ON DELETE RESTRICT,
        date_of_joining date,
        date_of_exit    date,
        is_active       boolean      NOT NULL DEFAULT true,
        created_at      timestamptz  NOT NULL DEFAULT now(),
        updated_at      timestamptz  NOT NULL DEFAULT now()
      );

      CREATE INDEX employees_is_active_idx ON employees (is_active);
      CREATE INDEX employees_branch_idx    ON employees (branch_id);

      -- ------------------------------------------------------------------ assets
      -- asset_tag comes from a sequence, never MAX(id)+1: two concurrent creates
      -- would read the same max and collide.
      CREATE SEQUENCE asset_tag_seq START 1;

      CREATE TABLE assets (
        id                bigserial PRIMARY KEY,
        asset_tag         varchar(32)    NOT NULL UNIQUE,
        serial_number     varchar(120)   NOT NULL,
        category_id       integer        NOT NULL REFERENCES asset_categories (id) ON DELETE RESTRICT,
        branch_id         integer        NOT NULL REFERENCES branches (id) ON DELETE RESTRICT,
        make              varchar(80)    NOT NULL,
        model             varchar(80)    NOT NULL,
        specification     text,
        status            asset_status   NOT NULL DEFAULT 'IN_STOCK',
        current_holder_id integer        REFERENCES employees (id) ON DELETE RESTRICT,
        purchase_date     date           NOT NULL,
        purchase_cost     numeric(12, 2) NOT NULL CHECK (purchase_cost >= 0),
        vendor            varchar(120),
        invoice_no        varchar(64),
        warranty_expiry   date,
        scrap_value       numeric(12, 2) CHECK (scrap_value IS NULL OR scrap_value >= 0),
        scrapped_at       timestamptz,
        scrap_reason      text,
        notes             text,
        created_at        timestamptz    NOT NULL DEFAULT now(),
        updated_at        timestamptz    NOT NULL DEFAULT now(),

        -- The two dangerous inconsistent states, made unrepresentable:
        -- "issued to nobody" and "scrapped with no scrap date".
        CONSTRAINT assets_issued_has_holder
          CHECK ((status = 'ISSUED') = (current_holder_id IS NOT NULL)),
        CONSTRAINT assets_scrapped_has_date
          CHECK ((status = 'SCRAPPED') = (scrapped_at IS NOT NULL))
      );

      -- A plain UNIQUE would let 'abc123' and ' ABC123 ' coexist, which is exactly how
      -- duplicate serials get into real inventories. The model normalises on write so
      -- the app and this index agree.
      CREATE UNIQUE INDEX assets_serial_uniq ON assets (upper(btrim(serial_number)));

      CREATE INDEX assets_status_idx           ON assets (status);
      CREATE INDEX assets_status_branch_idx    ON assets (status, branch_id);
      CREATE INDEX assets_category_idx         ON assets (category_id);
      CREATE INDEX assets_current_holder_idx   ON assets (current_holder_id);

      -- Requirement 2 searches by make/model; trigram indexes keep ILIKE '%...%' fast.
      CREATE EXTENSION IF NOT EXISTS pg_trgm;
      CREATE INDEX assets_make_trgm  ON assets USING gin (make gin_trgm_ops);
      CREATE INDEX assets_model_trgm ON assets USING gin (model gin_trgm_ops);

      -- ------------------------------------------------------ asset_transactions
      -- The append-only ledger. This table IS requirement 8.
      CREATE TABLE asset_transactions (
        id            bigserial PRIMARY KEY,
        asset_id      bigint         NOT NULL REFERENCES assets (id) ON DELETE RESTRICT,
        txn_type      txn_type       NOT NULL,
        -- Business event time, NOT row-insert time: backdating ("we gave it to him
        -- last Monday") is a real need. created_at below records the insert.
        txn_at        timestamptz    NOT NULL,
        from_status   asset_status,
        to_status     asset_status   NOT NULL,
        employee_id   integer        REFERENCES employees (id) ON DELETE RESTRICT,
        branch_id     integer        NOT NULL REFERENCES branches (id) ON DELETE RESTRICT,
        return_reason return_reason,
        -- Polymorphic money column: PURCHASE -> cost, REPAIR_COMPLETE -> repair bill,
        -- SCRAP -> value recovered. Makes the history totals one SUM, not three joins.
        amount        numeric(12, 2) CHECK (amount IS NULL OR amount >= 0),
        vendor        varchar(120),
        remarks       text,
        performed_by  varchar(80)    NOT NULL DEFAULT 'system',
        created_at    timestamptz    NOT NULL DEFAULT now(),

        CONSTRAINT txn_return_needs_reason
          CHECK (txn_type <> 'RETURN' OR return_reason IS NOT NULL),
        CONSTRAINT txn_issue_return_needs_employee
          CHECK (txn_type NOT IN ('ISSUE', 'RETURN') OR employee_id IS NOT NULL),
        -- from_status is NULL for PURCHASE (nothing preceded it) and set for everything
        -- else. That makes the ledger contiguous and therefore replayable.
        CONSTRAINT txn_purchase_has_no_from_status
          CHECK ((txn_type = 'PURCHASE') = (from_status IS NULL))
      );

      CREATE INDEX asset_txn_asset_idx    ON asset_transactions (asset_id, txn_at, id);
      CREATE INDEX asset_txn_employee_idx ON asset_transactions (employee_id, txn_at);
      CREATE INDEX asset_txn_type_idx     ON asset_transactions (txn_type);

      -- Append-only enforced by the database, not by convention.
      CREATE FUNCTION asset_transactions_append_only() RETURNS trigger AS $$
      BEGIN
        RAISE EXCEPTION 'asset_transactions is append-only: % is not permitted', TG_OP;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER asset_transactions_no_update_delete
        BEFORE UPDATE OR DELETE ON asset_transactions
        FOR EACH ROW EXECUTE FUNCTION asset_transactions_append_only();

      -- ----------------------------------------------------------- assets_active
      -- Requirement 7: a scrapped asset must not be visible on any page except reports.
      --
      -- Sequelize's defaultScope is NOT sufficient here: it applies to Asset.findAll()
      -- but is silently ignored when Asset appears inside an include(), so any join
      -- would leak scrapped rows. Enforcing it as a view means an operational page
      -- physically cannot see a scrapped asset, whatever query it writes.
      CREATE VIEW assets_active AS
        SELECT * FROM assets WHERE status <> 'SCRAPPED';
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(`
      DROP VIEW IF EXISTS assets_active;
      DROP TRIGGER IF EXISTS asset_transactions_no_update_delete ON asset_transactions;
      DROP FUNCTION IF EXISTS asset_transactions_append_only();
      DROP TABLE IF EXISTS asset_transactions;
      DROP TABLE IF EXISTS assets;
      DROP SEQUENCE IF EXISTS asset_tag_seq;
      DROP TABLE IF EXISTS employees;
      DROP TABLE IF EXISTS asset_categories;
      DROP TABLE IF EXISTS branches;
      DROP TYPE IF EXISTS return_reason;
      DROP TYPE IF EXISTS txn_type;
      DROP TYPE IF EXISTS asset_status;
    `);
  },
};
