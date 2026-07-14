import type { Response } from 'express'
import { today } from '../../common/format/parseFormDate'
import { findActiveBranches } from '../../masters/models/branch/findActiveBranches'
import type { TxRequest } from '../../transactionMiddleware'

export const newEmployeeForm = async (req: TxRequest, res: Response) => {
    const branches = await findActiveBranches(req.transactionClient)
    res.render('employees/form', { title: 'Add Employee', employee: null, branches, today: today() })
}
