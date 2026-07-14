import type { Response } from 'express'
import { parseFormDate } from '../../../common/format/parseFormDate'
import type { AssetStatus } from '../../../common/types/assetStatus'
import type { ReturnReason } from '../../../common/types/returnReason'
import type { TxRequest } from '../../../transactionMiddleware'
import { returnAsset } from '../../service/returnAsset'

interface ReturnBody {
    reason: ReturnReason
    returnDate?: string
    remarks?: string
}

const message = (assetTag: string, toStatus: AssetStatus) =>
    toStatus === 'IN_REPAIR'
        ? `${assetTag} returned and sent to repair. It will not appear in Stock until the repair is marked complete.`
        : `${assetTag} returned to stock.`

export const returnAssetController = async (req: TxRequest, res: Response) => {
    const body = req.body as ReturnBody
    const result = await returnAsset(
        Number(req.params.id),
        { reason: body.reason, txnAt: parseFormDate(body.returnDate, new Date()), remarks: body.remarks ?? null },
        req.transactionClient
    )
    req.flash('success', message(result.assetTag, result.toStatus))
    res.redirect(`/assets/${result.assetId}`)
}
