import type { Transaction } from 'sequelize'
import { moneyOrNull, orNull } from '../../../common/format/nullable'
import { AssetTransaction } from '../../../db/entities'
import type { AssetStatus } from '../../../common/types/assetStatus'
import type { LedgerFields } from '../../types/transitionInput'

interface LedgerRow extends LedgerFields {
    assetId: number
    branchId: number
    fromStatus: AssetStatus | null
    toStatus: AssetStatus
}

const optionalFields = (row: LedgerRow) => ({
    employeeId: orNull(row.employeeId),
    returnReason: orNull(row.returnReason),
    amount: moneyOrNull(row.amount),
    vendor: orNull(row.vendor),
    remarks: orNull(row.remarks),
    performedBy: row.performedBy ?? 'system'
})

export const createTransaction = (row: LedgerRow, tx?: Transaction) =>
    AssetTransaction.create(
        {
            assetId: row.assetId,
            txnType: row.txnType,
            txnAt: row.txnAt,
            fromStatus: row.fromStatus,
            toStatus: row.toStatus,
            branchId: row.branchId,
            ...optionalFields(row)
        },
        { transaction: tx }
    )
