import type { AssetStatus } from '../../../common/types/assetStatus'
import type { AssetAction } from '../../types/assetAction'

export const LEGAL_FROM: Record<AssetAction, readonly AssetStatus[]> = {
    ISSUE: ['IN_STOCK'],
    RETURN: ['ISSUED'],
    SEND_TO_REPAIR: ['IN_STOCK'],
    REPAIR_COMPLETE: ['IN_REPAIR'],
    SCRAP: ['IN_STOCK', 'IN_REPAIR']
}

export const isLegalTransition = (action: AssetAction, from: AssetStatus): boolean => LEGAL_FROM[action].includes(from)

export const isTerminal = (status: AssetStatus): boolean => status === 'SCRAPPED'
