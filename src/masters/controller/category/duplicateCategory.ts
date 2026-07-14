import { UniqueConstraintError } from 'sequelize'
import { throwError } from '../../../errorHandler'
import type { TxRequest } from '../../../transactionMiddleware'

export const duplicateCategory = (req: TxRequest, error: unknown) => {
    if (!(error instanceof UniqueConstraintError)) return throwError(error as Error)
    req.flash('error', 'A category with that code or name already exists.')
}
