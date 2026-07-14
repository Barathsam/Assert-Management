import type { Response } from 'express'
import type { TxRequest } from '../../transactionMiddleware'
import { integrityDrift } from '../models/integrityDrift'

export const integrity = async (_req: TxRequest, res: Response) => {
    const drift = await integrityDrift()
    res.render('reports/integrity', { title: 'Ledger Integrity', drift })
}
