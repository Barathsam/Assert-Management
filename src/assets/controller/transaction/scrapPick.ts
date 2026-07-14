import type { Response } from 'express'
import type { TxRequest } from '../../../transactionMiddleware'
import { findAssetsByStatus } from '../../models/asset/findAssetsByStatus'

export const scrapPickController = async (_req: TxRequest, res: Response) => {
    const assets = await findAssetsByStatus()
    res.render('transactions/scrap-pick', { title: 'Scrap Asset', assets })
}
