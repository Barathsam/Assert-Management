import type { Response } from 'express'
import { today } from '../../../common/format/parseFormDate'
import { RETURN_REASONS } from '../../../common/types/returnReason'
import type { TxRequest } from '../../../transactionMiddleware'
import { requireAsset } from './requireAsset'

export const scrapFormController = async (req: TxRequest, res: Response) => {
    const asset = await requireAsset(req.params.id as string, ['IN_STOCK', 'ISSUED', 'IN_REPAIR'])
    res.render('transactions/scrap', {
        title: `Scrap ${asset.assetTag}`,
        asset,
        reasons: RETURN_REASONS,
        today: today()
    })
}
