import type { Response } from 'express'
import { stockTotals } from '../../stock/domain/stockTotals'
import { stockRows } from '../../stock/models/stockRows'
import type { StockQuery } from '../../stock/types/stockQuery'
import type { TxRequest } from '../../transactionMiddleware'

const filtersOf = (query: StockQuery) => ({
    branchId: Number(query.branchId) || undefined,
    categoryId: Number(query.categoryId) || undefined
})

export const stockJsonController = async (req: TxRequest, res: Response) => {
    const rows = await stockRows(filtersOf(req.query as StockQuery))
    res.json({ rows, ...stockTotals(rows) })
}
