import type { Response } from 'express'
import type { Branch } from '../../../db/entities'
import type { TxRequest } from '../../../transactionMiddleware'
import { createBranch } from '../../models/branch/createBranch'
import type { BranchFields } from '../../types/masterTypes'
import { duplicateBranch } from './duplicateBranch'

const created = (req: TxRequest, branch: Branch) => req.flash('success', `Branch ${branch.name} created.`)

export const createBranchController = async (req: TxRequest, res: Response) => {
    await createBranch(req.body as BranchFields, req.transactionClient)
        .then((branch) => created(req, branch))
        .catch((error: unknown) => duplicateBranch(req, error))
    res.redirect('/branches')
}
