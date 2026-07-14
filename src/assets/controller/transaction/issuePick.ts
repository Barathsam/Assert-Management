import type { Response } from 'express'
import type { TxRequest } from '../../../transactionMiddleware'
import { findAssetsByStatus } from '../../models/asset/findAssetsByStatus'

export const issuePickController = async (_req: TxRequest, res: Response) => {
    const assets = await findAssetsByStatus('IN_STOCK')
    res.render('transactions/issue-pick', { title: 'Issue Asset', assets })
}
