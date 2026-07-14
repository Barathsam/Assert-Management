import type { Response } from 'express'
import type { TxRequest } from '../../../transactionMiddleware'
import { findAssetsByStatus } from '../../models/asset/findAssetsByStatus'

export const returnPickController = async (_req: TxRequest, res: Response) => {
    const assets = await findAssetsByStatus('ISSUED')
    res.render('transactions/return-pick', { title: 'Return Asset', assets })
}
