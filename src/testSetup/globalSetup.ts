import 'dotenv/config'
import { execFileSync } from 'node:child_process'
import { Sequelize } from 'sequelize'
import { adminUrl, BASE_DB_NAME, TEST_DB_NAME } from './testDbConfig'

const recreateDatabase = async () => {
    const admin = new Sequelize(adminUrl(), { logging: false })
    await admin.query(`DROP DATABASE IF EXISTS ${TEST_DB_NAME}`)
    await admin.query(`CREATE DATABASE ${TEST_DB_NAME}`)
    await admin.close()
}

const migrate = () =>
    execFileSync('npx', ['sequelize-cli', 'db:migrate'], {
        env: { ...process.env, NODE_ENV: 'test', DB_NAME: BASE_DB_NAME },
        stdio: 'pipe'
    })

export const setup = async () => {
    await recreateDatabase()
    migrate()
}
