import type { StockRow } from '../types/stockRow'
import type { BranchTotal, StockTotals } from '../types/stockTotals'

const sumQty = (rows: StockRow[]): number => rows.reduce((total, row) => total + Number(row.qty), 0)

const sumValue = (rows: StockRow[]): number => rows.reduce((total, row) => total + Number(row.value), 0)

const branchNames = (rows: StockRow[]): string[] => [...new Set(rows.map((row) => row.branchName))]

const rowsOf = (rows: StockRow[], branchName: string): StockRow[] => rows.filter((row) => row.branchName === branchName)

const branchTotal = (rows: StockRow[], branchName: string): BranchTotal => ({
    branchName,
    qty: sumQty(rowsOf(rows, branchName)),
    value: sumValue(rowsOf(rows, branchName))
})

export const stockTotals = (rows: StockRow[]): StockTotals => ({
    byBranch: branchNames(rows).map((branchName) => branchTotal(rows, branchName)),
    totalQty: sumQty(rows),
    totalValue: sumValue(rows)
})
