export const ASSET_ACTIONS = ['ISSUE', 'RETURN', 'SEND_TO_REPAIR', 'REPAIR_COMPLETE', 'SCRAP'] as const

export type AssetAction = (typeof ASSET_ACTIONS)[number]
