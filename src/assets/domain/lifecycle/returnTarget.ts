import type { AssetStatus } from '../../../common/types/assetStatus'
import type { ReturnReason } from '../../../common/types/returnReason'

const TARGET: Record<ReturnReason, AssetStatus> = {
    REPAIR: 'IN_REPAIR',
    DAMAGED: 'IN_REPAIR',
    UPGRADE: 'IN_STOCK',
    RESIGNATION: 'IN_STOCK',
    PROJECT_END: 'IN_STOCK',
    NOT_REQUIRED: 'IN_STOCK',
    OTHER: 'IN_STOCK'
}

export const returnTarget = (reason: ReturnReason): AssetStatus => TARGET[reason]
