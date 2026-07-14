import type { Response } from 'express'
import type { Branch } from '../../../db/entities'
import type { TxRequest } from '../../../transactionMiddleware'
import { findBranchById } from '../../models/branch/findBranchById'
import { toggleBranchActive } from '../../models/branch/toggleBranchActive'

const toggle = (req: TxRequest, branch: Branch) =>
    toggleBranchActive(branch, req.transactionClient).then((next) =>
        req.flash('success', `${next.name} ${next.isActive ? 'activated' : 'deactivated'}.`)
    )

export const toggleBranchController = async (req: TxRequest, res: Response) => {
    const branch = await findBranchById(Number(req.params.id), req.transactionClient)
    if (branch) await toggle(req, branch)
    res.redirect('/branches')
}
