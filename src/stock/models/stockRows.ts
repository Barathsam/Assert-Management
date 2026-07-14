import { QueryTypes } from 'sequelize'
import { sequelize } from '../../db/sequelize'
import type { StockFilters } from '../types/stockFilters'
import type { StockRow } from '../types/stockRow'

const SQL = `SELECT b.id                        AS "branchId",
                    b.name                      AS "branchName",
                    c.id                        AS "categoryId",
                    c.name                      AS "categoryName",
                    COUNT(*)::int               AS qty,
                    SUM(a.purchase_cost)::float8 AS value
               FROM assets_active a
               JOIN branches b         ON b.id = a.branch_id
               JOIN asset_categories c ON c.id = a.category_id
              WHERE a.status = 'IN_STOCK'
                AND (:branchId::int   IS NULL OR a.branch_id   = :branchId)
                AND (:categoryId::int IS NULL OR a.category_id = :categoryId)
              GROUP BY b.id, b.name, c.id, c.name
              ORDER BY b.name, c.name`

export const stockRows = (filters: StockFilters): Promise<StockRow[]> =>
    sequelize.query<StockRow>(SQL, {
        replacements: {
            branchId: filters.branchId ?? null,
            categoryId: filters.categoryId ?? null
        },
        type: QueryTypes.SELECT
    })
