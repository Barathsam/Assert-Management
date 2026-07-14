import type { Response } from 'express'
import type { TxRequest } from '../../transactionMiddleware'
import { ledgerRows } from '../models/ledgerRows'

export const ledger = async (_req: TxRequest, res: Response) => {
    const transactions = await ledgerRows()
    res.render('reports/ledger', { title: 'Transaction Ledger', transactions })
}
