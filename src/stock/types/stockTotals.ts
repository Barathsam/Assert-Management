export interface BranchTotal {
    branchName: string
    qty: number
    value: number
}

export interface StockTotals {
    byBranch: BranchTotal[]
    totalQty: number
    totalValue: number
}
