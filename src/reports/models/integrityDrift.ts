import { QueryTypes } from 'sequelize'
import { sequelize } from '../../db/sequelize'
import type { IntegrityRow } from '../types/integrityRow'

const SQL = `SELECT a.id                 AS "assetId",
                    a.asset_tag          AS "assetTag",
                    a.status::text       AS "assetStatus",
                    last.to_status::text AS "ledgerStatus"
               FROM assets a
               LEFT JOIN LATERAL (
                 SELECT t.to_status
                   FROM asset_transactions t
                  WHERE t.asset_id = a.id
                  ORDER BY t.txn_at DESC, t.id DESC
                  LIMIT 1
               ) last ON true
              WHERE last.to_status IS DISTINCT FROM a.status`

export const integrityDrift = (): Promise<IntegrityRow[]> =>
    sequelize.query<IntegrityRow>(SQL, { type: QueryTypes.SELECT })
