import type { Response } from 'express'
import { today } from '../../../common/format/parseFormDate'
import type { TxRequest } from '../../../transactionMiddleware'
import { requireAsset } from './requireAsset'

export const sendToRepairFormController = async (req: TxRequest, res: Response) => {
    const asset = await requireAsset(req.params.id as string, ['IN_STOCK'])
    res.render('transactions/send-to-repair', {
        title: `Send ${asset.assetTag} to Repair`,
        asset,
        today: today()
    })
}
