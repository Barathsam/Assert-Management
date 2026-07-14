import type { Response } from 'express'
import { today } from '../../../common/format/parseFormDate'
import type { TxRequest } from '../../../transactionMiddleware'
import { requireAsset } from './requireAsset'

export const repairCompleteFormController = async (req: TxRequest, res: Response) => {
    const asset = await requireAsset(req.params.id as string, ['IN_REPAIR'])
    res.render('transactions/repair-complete', {
        title: `Repair Complete — ${asset.assetTag}`,
        asset,
        today: today()
    })
}
