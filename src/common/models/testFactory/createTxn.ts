import { AssetTransaction } from '../../../db/entities'
import type { AssetStatus } from '../../types/assetStatus'
import type { ReturnReason } from '../../types/returnReason'
import type { TxnType } from '../../types/txnType'

export interface TxnOverrides {
    assetId: number
    branchId: number
    txnType: TxnType
    toStatus: AssetStatus
    fromStatus?: AssetStatus | null
    txnAt?: Date
    employeeId?: number | null
    returnReason?: ReturnReason | null
    amount?: string | null
    vendor?: string | null
    remarks?: string | null
}

export const createTxn = (overrides: TxnOverrides) =>
    AssetTransaction.create({
        txnAt: new Date('2024-01-01T00:00:00Z'),
        fromStatus: null,
        employeeId: null,
        returnReason: null,
        amount: null,
        vendor: null,
        remarks: null,
        ...overrides
    })
