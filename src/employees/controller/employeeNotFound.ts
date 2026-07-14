import type { Response } from 'express'
import type { TxRequest } from '../../transactionMiddleware'

export const employeeNotFound = (req: TxRequest, res: Response) => {
    req.flash('error', 'Employee not found.')
    res.redirect('/employees')
}
