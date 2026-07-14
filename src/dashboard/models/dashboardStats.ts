import { QueryTypes } from 'sequelize'
import { sequelize } from '../../db/sequelize'
import type { DashboardStats } from '../types/dashboardStats'

const ZERO: DashboardStats = {
    totalAssets: 0,
    inStock: 0,
    issued: 0,
    inRepair: 0,
    scrapped: 0,
    totalValue: 0,
    activeEmployees: 0
}

const SQL = `SELECT COUNT(*) FILTER (WHERE status <> 'SCRAPPED')::int AS "totalAssets",
                    COUNT(*) FILTER (WHERE status = 'IN_STOCK')::int  AS "inStock",
                    COUNT(*) FILTER (WHERE status = 'ISSUED')::int    AS "issued",
                    COUNT(*) FILTER (WHERE status = 'IN_REPAIR')::int AS "inRepair",
                    COUNT(*) FILTER (WHERE status = 'SCRAPPED')::int  AS "scrapped",
                    COALESCE(SUM(purchase_cost) FILTER (WHERE status <> 'SCRAPPED'), 0)::float8 AS "totalValue",
                    (SELECT COUNT(*) FROM employees WHERE is_active)::int AS "activeEmployees"
               FROM assets`

export const dashboardStats = async (): Promise<DashboardStats> => {
    const [row] = await sequelize.query<DashboardStats>(SQL, { type: QueryTypes.SELECT })
    return row ?? ZERO
}
