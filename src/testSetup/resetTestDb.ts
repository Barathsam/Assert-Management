import type { Sequelize } from 'sequelize'

let cachedTruncateSql: string | null = null

const tableList = async (sequelize: Sequelize): Promise<string[]> => {
    const [rows] = await sequelize.query(
        `SELECT tablename FROM pg_tables
          WHERE schemaname = 'public' AND tablename <> 'SequelizeMeta'`
    )
    return (rows as { tablename: string }[]).map((r) => `"public"."${r.tablename}"`)
}

const buildTruncateSql = async (sequelize: Sequelize): Promise<string> => {
    const tables = await tableList(sequelize)
    return tables.length ? `TRUNCATE ${tables.join(', ')} RESTART IDENTITY CASCADE` : ''
}

export const resetTestDb = async (sequelize: Sequelize): Promise<void> => {
    cachedTruncateSql = cachedTruncateSql ?? (await buildTruncateSql(sequelize))
    await (cachedTruncateSql ? sequelize.query(cachedTruncateSql) : Promise.resolve())
    await sequelize.query(`ALTER SEQUENCE asset_tag_seq RESTART WITH 1`)
}
