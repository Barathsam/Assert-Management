import type { Response } from 'express'
import { ASSET_STATUSES } from '../../../common/types/assetStatus'
import { findBranches } from '../../../masters/models/branch/findBranches'
import { findCategories } from '../../../masters/models/category/findCategories'
import { findActiveAssets } from '../../models/asset/findActiveAssets'
import type { TxRequest } from '../../../transactionMiddleware'
import { asId, assetFilters, type AssetQuery } from './assetFilters'

const echo = (query: AssetQuery) => ({
    categoryId: asId(query.categoryId),
    branchId: asId(query.branchId),
    status: query.status ?? '',
    q: query.q ?? ''
})

const issuableStatuses = ASSET_STATUSES.filter((status) => status !== 'SCRAPPED')

export const listAssetsController = async (req: TxRequest, res: Response) => {
    const query = req.query as AssetQuery
    const [assets, categories, branches] = await Promise.all([
        findActiveAssets(assetFilters(query)),
        findCategories(),
        findBranches()
    ])
    res.render('assets/index', {
        title: 'Assets',
        assets,
        categories,
        branches,
        statuses: issuableStatuses,
        filters: echo(query)
    })
}
