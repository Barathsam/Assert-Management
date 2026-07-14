import type { Response } from 'express'
import { today } from '../../../common/format/parseFormDate'
import { RETURN_REASONS } from '../../../common/types/returnReason'
import type { TxRequest } from '../../../transactionMiddleware'
import { requireAsset } from './requireAsset'

export const returnFormController = async (req: TxRequest, res: Response) => {
    const asset = await requireAsset(req.params.id as string, ['ISSUED'])
    res.render('transactions/return', {
        title: `Return ${asset.assetTag}`,
        asset,
        reasons: RETURN_REASONS,
        preselect: (req.query.reason as string) ?? '',
        today: today()
    })
}
