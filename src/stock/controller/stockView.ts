import type { Response } from 'express'
import { findBranches } from '../../masters/models/branch/findBranches'
import { findCategories } from '../../masters/models/category/findCategories'
import type { TxRequest } from '../../transactionMiddleware'
import { stockTotals } from '../domain/stockTotals'
import { stockRows } from '../models/stockRows'
import type { StockFilters } from '../types/stockFilters'
import type { StockQuery } from '../types/stockQuery'

const filtersOf = (query: StockQuery): StockFilters => ({
    branchId: Number(query.branchId) || undefined,
    categoryId: Number(query.categoryId) || undefined
})

export const stockView = async (req: TxRequest, res: Response) => {
    const filters = filtersOf(req.query as StockQuery)
    const [rows, branches, categories] = await Promise.all([stockRows(filters), findBranches(), findCategories()])
    res.render('stock/index', {
        title: 'Stock View',
        stock: { rows, ...stockTotals(rows) },
        branches,
        categories,
        filters
    })
}
