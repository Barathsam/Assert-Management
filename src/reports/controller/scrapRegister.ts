import type { Response } from 'express'
import type { TxRequest } from '../../transactionMiddleware'
import { scrappedAssets } from '../models/scrappedAssets'

export const scrapRegister = async (_req: TxRequest, res: Response) => {
    const assets = await scrappedAssets()
    res.render('reports/scrapped', { title: 'Scrap Register', assets })
}
