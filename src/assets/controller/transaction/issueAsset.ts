import type { Response } from 'express'
import { parseFormDate } from '../../../common/format/parseFormDate'
import type { TxRequest } from '../../../transactionMiddleware'
import { issueAsset } from '../../service/issueAsset'

interface IssueBody {
    employeeId: number
    issueDate?: string
    remarks?: string
}

export const issueAssetController = async (req: TxRequest, res: Response) => {
    const body = req.body as IssueBody
    const asset = await issueAsset(
        Number(req.params.id),
        {
            employeeId: body.employeeId,
            txnAt: parseFormDate(body.issueDate, new Date()),
            remarks: body.remarks ?? null
        },
        req.transactionClient
    )
    req.flash('success', `${asset.assetTag} issued.`)
    res.redirect(`/assets/${asset.id}`)
}
