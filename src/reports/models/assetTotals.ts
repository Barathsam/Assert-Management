import { QueryTypes } from 'sequelize'
import { sequelize } from '../../db/sequelize'
import type { AssetTotalsRow } from '../types/assetTotalsRow'

const ZERO: AssetTotalsRow = { purchaseCost: 0, repairCost: 0, scrapValue: 0, repairCount: 0, daysOwned: 0 }

const SQL = `SELECT COALESCE(SUM(t.amount) FILTER (WHERE t.txn_type = 'PURCHASE'), 0)::float8         AS "purchaseCost",
                    COALESCE(SUM(t.amount) FILTER (WHERE t.txn_type = 'REPAIR_COMPLETE'), 0)::float8 AS "repairCost",
                    COALESCE(SUM(t.amount) FILTER (WHERE t.txn_type = 'SCRAP'), 0)::float8           AS "scrapValue",
                    COUNT(*) FILTER (WHERE t.txn_type = 'REPAIR_COMPLETE')::int                      AS "repairCount",
                    (COALESCE(a.scrapped_at::date, CURRENT_DATE) - a.purchase_date)::int             AS "daysOwned"
               FROM assets a
               LEFT JOIN asset_transactions t ON t.asset_id = a.id
              WHERE a.id = :assetId
              GROUP BY a.id, a.scrapped_at, a.purchase_date`

export const assetTotals = async (assetId: number): Promise<AssetTotalsRow> => {
    const [row] = await sequelize.query<AssetTotalsRow>(SQL, {
        replacements: { assetId },
        type: QueryTypes.SELECT
    })
    return row ?? ZERO
}
