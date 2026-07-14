import type { Response } from 'express'
import type { TxRequest } from '../../transactionMiddleware'

export const reportsIndex = (_req: TxRequest, res: Response): void => {
    res.render('reports/index', { title: 'Reports' })
}
