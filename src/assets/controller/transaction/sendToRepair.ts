import type { Response } from 'express'
import { parseFormDate } from '../../../common/format/parseFormDate'
import type { TxRequest } from '../../../transactionMiddleware'
import { sendToRepair } from '../../service/repairAsset'

interface RepairBody {
    date?: string
    vendor?: string
    remarks?: string
}

export const sendToRepairController = async (req: TxRequest, res: Response) => {
    const body = req.body as RepairBody
    const asset = await sendToRepair(
        Number(req.params.id),
        { txnAt: parseFormDate(body.date, new Date()), vendor: body.vendor ?? null, remarks: body.remarks ?? null },
        req.transactionClient
    )
    req.flash('success', `${asset.assetTag} sent for repair.`)
    res.redirect(`/assets/${asset.id}`)
}
