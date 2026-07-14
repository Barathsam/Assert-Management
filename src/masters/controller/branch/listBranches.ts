import type { Response } from 'express'
import type { TxRequest } from '../../../transactionMiddleware'
import { findBranches } from '../../models/branch/findBranches'

export const listBranches = async (req: TxRequest, res: Response) => {
    const branches = await findBranches(req.transactionClient)
    res.render('branches/index', { title: 'Branches', branches })
}
