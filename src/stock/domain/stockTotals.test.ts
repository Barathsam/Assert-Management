import { stockTotals } from './stockTotals'
import type { StockRow } from '../types/stockRow'

const row = (branchName: string, categoryName: string, qty: number, value: number): StockRow => ({
    branchId: branchName === 'Chennai' ? 1 : 2,
    branchName,
    categoryId: categoryName === 'Laptop' ? 1 : 2,
    categoryName,
    qty,
    value
})

describe('stockTotals', () => {
    test('is empty for no rows', () => {
        expect(stockTotals([])).toEqual({ byBranch: [], totalQty: 0, totalValue: 0 })
    })

    test('subtotals every category of a branch into one branch line', () => {
        const rows = [row('Chennai', 'Laptop', 2, 100000), row('Chennai', 'Monitor', 3, 30000)]

        expect(stockTotals(rows).byBranch).toEqual([{ branchName: 'Chennai', qty: 5, value: 130000 }])
    })

    test('keeps branches apart and preserves their row order', () => {
        const rows = [row('Chennai', 'Laptop', 2, 100000), row('Mumbai', 'Laptop', 1, 45000)]

        expect(stockTotals(rows).byBranch).toEqual([
            { branchName: 'Chennai', qty: 2, value: 100000 },
            { branchName: 'Mumbai', qty: 1, value: 45000 }
        ])
    })

    test('grand totals span every branch', () => {
        const rows = [row('Chennai', 'Laptop', 2, 100000), row('Mumbai', 'Monitor', 3, 45000)]

        expect(stockTotals(rows)).toMatchObject({ totalQty: 5, totalValue: 145000 })
    })

    test('adds money numerically when a DECIMAL arrives as the string Sequelize gives', () => {
        const rows = [
            { ...row('Chennai', 'Laptop', 2, 0), value: '82000' as unknown as number },
            { ...row('Chennai', 'Monitor', 3, 0), value: '4500' as unknown as number }
        ]

        const totals = stockTotals(rows)

        expect(totals.totalValue).toBe(86500)
        expect(totals.byBranch).toEqual([{ branchName: 'Chennai', qty: 5, value: 86500 }])
    })
})
