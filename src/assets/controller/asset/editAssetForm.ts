import type { Response } from 'express'
import { today } from '../../../common/format/parseFormDate'
import { findActiveBranches } from '../../../masters/models/branch/findActiveBranches'
import { findActiveCategories } from '../../../masters/models/category/findActiveCategories'
import type { TxRequest } from '../../../transactionMiddleware'
import { findActiveAssetById } from '../../models/asset/findActiveAssetById'

export const editAssetFormController = async (req: TxRequest, res: Response) => {
    const [asset, categories, branches] = await Promise.all([
        findActiveAssetById(req.params.id as string),
        findActiveCategories(),
        findActiveBranches()
    ])
    if (!asset) {
        req.flash('error', 'Asset not found.')
        return res.redirect('/assets')
    }
    res.render('assets/form', { title: `Edit ${asset.assetTag}`, asset, categories, branches, today: today() })
}
