import type { AssetTotalsRow } from './assetTotalsRow'
import type { Utilisation } from './utilisation'

export type AssetTotals = AssetTotalsRow & Utilisation & { netCost: number }
