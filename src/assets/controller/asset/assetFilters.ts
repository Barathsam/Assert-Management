import { Op, type WhereOptions } from 'sequelize'
import { ASSET_STATUSES, type AssetStatus } from '../../../common/types/assetStatus'

export interface AssetQuery {
    categoryId?: string
    branchId?: string
    status?: string
    q?: string
}

export const asId = (value?: string): number | undefined => {
    const n = Number(value)
    return Number.isInteger(n) && n > 0 ? n : undefined
}

const asStatus = (value?: string): AssetStatus | undefined =>
    ASSET_STATUSES.includes(value as AssetStatus) ? (value as AssetStatus) : undefined

const searchClause = (q: string) => ({
    [Op.or]: ['make', 'model', 'serialNumber', 'assetTag'].map((field) => ({
        [field]: { [Op.iLike]: `%${q}%` }
    }))
})

const defined = (entries: [string, unknown][]) => Object.fromEntries(entries.filter(([, v]) => v !== undefined))

export const assetFilters = (query: AssetQuery): WhereOptions => {
    const q = (query.q ?? '').trim()
    const scalars = defined([
        ['categoryId', asId(query.categoryId)],
        ['branchId', asId(query.branchId)],
        ['status', asStatus(query.status)]
    ])
    return { ...scalars, ...(q ? searchClause(q) : {}) }
}
