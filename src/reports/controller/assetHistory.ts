import type { Response } from 'express'
import type { TxRequest } from '../../transactionMiddleware'
import { netCost } from '../domain/netCost'
import { utilisation } from '../domain/utilisation'
import { assetForHistory } from '../models/assetForHistory'
import { assetTotals } from '../models/assetTotals'
import { historyTimeline } from '../models/historyTimeline'
import { holdingIntervals } from '../models/holdingIntervals'
import type { AssetTotals } from '../types/assetTotals'
import type { AssetTotalsRow } from '../types/assetTotalsRow'
import type { HoldingInterval } from '../types/holdingInterval'

const compose = (row: AssetTotalsRow, holdings: HoldingInterval[]): AssetTotals => ({
    ...row,
    netCost: netCost(row),
    ...utilisation(holdings, row.daysOwned)
})

const notFound = (req: TxRequest, res: Response): void => {
    req.flash('error', 'Asset not found.')
    res.redirect('/reports')
}

export const assetHistory = async (req: TxRequest, res: Response) => {
    const assetId = Number(req.params.id)
    const asset = await assetForHistory(assetId)
    if (!asset) return notFound(req, res)
    const [row, timeline, holdings] = await Promise.all([
        assetTotals(assetId),
        historyTimeline(assetId),
        holdingIntervals(assetId)
    ])
    res.render('reports/history', {
        title: `History — ${asset.assetTag}`,
        asset,
        totals: compose(row, holdings),
        timeline,
        holdings
    })
}
