import { UniqueConstraintError } from 'sequelize'
import { throwError } from '../../../errorHandler'
import type { TxRequest } from '../../../transactionMiddleware'

export const duplicateBranch = (req: TxRequest, error: unknown) => {
    if (!(error instanceof UniqueConstraintError)) return throwError(error as Error)
    req.flash('error', `Branch code "${String(req.body.code).toUpperCase()}" is already in use.`)
}
