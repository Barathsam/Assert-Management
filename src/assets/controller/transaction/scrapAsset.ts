import type { Response } from 'express'
import { parseFormDate } from '../../../common/format/parseFormDate'
import type { ReturnReason } from '../../../common/types/returnReason'
import type { TxRequest } from '../../../transactionMiddleware'
import { scrapAsset } from '../../service/scrapAsset'

interface ScrapBody {
    date?: string
    scrapValue?: number
    reason: string
    returnReason?: ReturnReason
    remarks?: string
}

const scrapped = (assetTag: string) =>
    `${assetTag} scrapped. It is now hidden from all operational pages — see Reports for its history.`

export const scrapAssetController = async (req: TxRequest, res: Response) => {
    const body = req.body as ScrapBody
    const asset = await scrapAsset(
        Number(req.params.id),
        {
            txnAt: parseFormDate(body.date, new Date()),
            scrapValue: body.scrapValue ?? 0,
            reason: body.reason,
            returnReason: body.returnReason,
            remarks: body.remarks ?? null
        },
        req.transactionClient
    )
    req.flash('success', scrapped(asset.assetTag))
    res.redirect(`/reports/history/${asset.id}`)
}
