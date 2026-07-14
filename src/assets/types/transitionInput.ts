import type { AssetStatus } from '../../common/types/assetStatus'
import type { ReturnReason } from '../../common/types/returnReason'
import type { TxnType } from '../../common/types/txnType'
import type { Asset } from '../../db/entities'
import type { AssetAction } from './assetAction'

export interface LedgerFields {
    txnType: TxnType
    txnAt: Date
    employeeId?: number | null
    returnReason?: ReturnReason | null
    amount?: string | number | null
    vendor?: string | null
    remarks?: string | null
    performedBy?: string
}

export interface TransitionInput {
    assetId: number
    action: AssetAction
    toStatus: AssetStatus
    ledger: LedgerFields
    mutate: (asset: Asset) => void
}
