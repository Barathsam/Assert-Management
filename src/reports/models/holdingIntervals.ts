import { QueryTypes } from 'sequelize'
import { sequelize } from '../../db/sequelize'
import type { HoldingInterval } from '../types/holdingInterval'

const SQL = `WITH events AS (
                 SELECT t.txn_type,
                        t.txn_at,
                        t.employee_id,
                        LEAD(t.txn_at)        OVER (ORDER BY t.txn_at, t.id) AS next_at,
                        LEAD(t.return_reason) OVER (ORDER BY t.txn_at, t.id) AS next_reason
                   FROM asset_transactions t
                  WHERE t.asset_id = :assetId
                    AND t.txn_type IN ('ISSUE', 'RETURN')
             )
             SELECT e.employee_id                                          AS "employeeId",
                    emp.first_name || ' ' || emp.last_name                 AS "employeeName",
                    emp.employee_code                                      AS "employeeCode",
                    e.txn_at                                               AS "issuedAt",
                    e.next_at                                              AS "returnedAt",
                    e.next_reason::text                                    AS "returnReason",
                    (COALESCE(e.next_at, now())::date - e.txn_at::date)::int AS days
               FROM events e
               JOIN employees emp ON emp.id = e.employee_id
              WHERE e.txn_type = 'ISSUE'
              ORDER BY e.txn_at`

export const holdingIntervals = (assetId: number): Promise<HoldingInterval[]> =>
    sequelize.query<HoldingInterval>(SQL, { replacements: { assetId }, type: QueryTypes.SELECT })
