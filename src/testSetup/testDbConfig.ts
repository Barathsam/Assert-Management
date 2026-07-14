export const BASE_DB_NAME = 'asset_management'

export const TEST_DB_NAME = `${BASE_DB_NAME}_test`

export const adminUrl = () => {
    const host = process.env.DB_HOST ?? 'localhost'
    const port = process.env.DB_PORT ?? '5433'
    const user = process.env.DB_USER ?? 'postgres'
    const password = process.env.DB_PASSWORD ?? 'postgres'
    return `postgres://${user}:${password}@${host}:${port}/postgres`
}
