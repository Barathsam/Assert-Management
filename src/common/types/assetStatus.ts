export const ASSET_STATUSES = ['IN_STOCK', 'ISSUED', 'IN_REPAIR', 'SCRAPPED'] as const

export type AssetStatus = (typeof ASSET_STATUSES)[number]
