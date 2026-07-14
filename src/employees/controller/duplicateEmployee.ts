import type { Response } from 'express'
import { UniqueConstraintError } from 'sequelize'
import { throwError } from '../../errorHandler'
import type { TxRequest } from '../../transactionMiddleware'

export const duplicateEmployee = (req: TxRequest, res: Response, backTo: string, error: unknown) => {
    if (!(error instanceof UniqueConstraintError)) return throwError(error as Error)
    req.flash('error', 'That employee code or email is already in use.')
    res.redirect(backTo)
}
