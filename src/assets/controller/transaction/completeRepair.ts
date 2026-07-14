import type { Response } from 'express'
import { orNull, orZero } from '../../../common/format/nullable'
import { parseFormDate } from '../../../common/format/parseFormDate'
import type { TxRequest } from '../../../transactionMiddleware'
import { completeRepair } from '../../service/repairAsset'

interface CompleteBody {
    date?: string
    cost?: number
    vendor?: string
    remarks?: string
}

const toInput = (body: CompleteBody) => ({
    txnAt: parseFormDate(body.date, new Date()),
    cost: orZero(body.cost),
    vendor: orNull(body.vendor),
    remarks: orNull(body.remarks)
})

export const completeRepairController = async (req: TxRequest, res: Response) => {
    const asset = await completeRepair(Number(req.params.id), toInput(req.body as CompleteBody), req.transactionClient)
    req.flash('success', `${asset.assetTag} repaired and back in stock.`)
    res.redirect(`/assets/${asset.id}`)
}
