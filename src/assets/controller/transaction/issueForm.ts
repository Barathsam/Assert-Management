import type { Response } from 'express'
import { today } from '../../../common/format/parseFormDate'
import { findActiveEmployees } from '../../../employees/models/employee/findActiveEmployees'
import type { TxRequest } from '../../../transactionMiddleware'
import { requireAsset } from './requireAsset'

export const issueFormController = async (req: TxRequest, res: Response) => {
    const asset = await requireAsset(req.params.id as string, ['IN_STOCK'])
    const employees = await findActiveEmployees()
    res.render('transactions/issue', { title: `Issue ${asset.assetTag}`, asset, employees, today: today() })
}
