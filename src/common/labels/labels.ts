import type { AssetStatus } from '../types/assetStatus'
import type { ReturnReason } from '../types/returnReason'
import type { TxnType } from '../types/txnType'

export const STATUS_LABEL: Record<AssetStatus, string> = {
    IN_STOCK: 'In Stock',
    ISSUED: 'Issued',
    IN_REPAIR: 'In Repair',
    SCRAPPED: 'Scrapped'
}

export const STATUS_BADGE: Record<AssetStatus, string> = {
    IN_STOCK: 'success',
    ISSUED: 'primary',
    IN_REPAIR: 'warning',
    SCRAPPED: 'secondary'
}

export const TXN_LABEL: Record<TxnType, string> = {
    PURCHASE: 'Purchased',
    ISSUE: 'Issued',
    RETURN: 'Returned',
    SEND_TO_REPAIR: 'Sent to Repair',
    REPAIR_COMPLETE: 'Repair Complete',
    SCRAP: 'Scrapped'
}

export const RETURN_REASON_LABEL: Record<ReturnReason, string> = {
    UPGRADE: 'Upgrade',
    REPAIR: 'Repair',
    DAMAGED: 'Damaged',
    RESIGNATION: 'Resignation',
    PROJECT_END: 'Project End',
    NOT_REQUIRED: 'Not Required',
    OTHER: 'Other'
}
