import 'dotenv/config'
import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize(
    process.env.DB_NAME ?? 'asset_management',
    process.env.DB_USER ?? 'postgres',
    process.env.DB_PASSWORD ?? 'postgres',
    {
        host: process.env.DB_HOST ?? 'localhost',
        port: Number(process.env.DB_PORT ?? 5433),
        dialect: 'postgres',
        logging: false,
        define: { underscored: true, freezeTableName: true }
    }
)
