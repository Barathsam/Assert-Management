// Consumed by sequelize-cli (migrations + seeders). Plain CommonJS on purpose:
// the CLI loads this file directly, so it must not go through the TS build.
require('dotenv').config();

const base = {
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'asset_management',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  dialect: 'postgres',
  logging: false,
  define: {
    underscored: true,
    freezeTableName: true,
  },
  // Record which seeders have run, in a SequelizeData table.
  //
  // sequelize-cli defaults this to 'none', which means db:seed:all re-runs the seeders on
  // EVERY invocation. Since `docker compose up` seeds on boot, a second `up` against an
  // existing volume would re-insert the demo data, trip the unique index on branch code, and
  // take the app container down with it. Tracking makes seeding idempotent.
  seederStorage: 'sequelize',
};

module.exports = {
  development: base,
  test: { ...base, database: `${base.database}_test` },
  production: base,
};
