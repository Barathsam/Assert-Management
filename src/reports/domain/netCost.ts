import type { AssetTotalsRow } from '../types/assetTotalsRow'

export const netCost = (totals: AssetTotalsRow): number =>
    Number(totals.purchaseCost) + Number(totals.repairCost) - Number(totals.scrapValue)
