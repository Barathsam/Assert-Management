import type { Response } from 'express'
import type { Branch } from '../../../db/entities'
import type { TxRequest } from '../../../transactionMiddleware'
import { findBranchById } from '../../models/branch/findBranchById'
import { updateBranch } from '../../models/branch/updateBranch'
import type { BranchFields } from '../../types/masterTypes'
import { duplicateBranch } from './duplicateBranch'

const missing = (req: TxRequest) => req.flash('error', 'Branch not found.')

const save = (req: TxRequest, branch: Branch) =>
    updateBranch(branch, req.body as BranchFields, req.transactionClient)
        .then((saved) => req.flash('success', `Branch ${saved.name} updated.`))
        .catch((error: unknown) => duplicateBranch(req, error))

export const updateBranchController = async (req: TxRequest, res: Response) => {
    const branch = await findBranchById(Number(req.params.id), req.transactionClient)
    await (branch ? save(req, branch) : missing(req))
    res.redirect('/branches')
}
