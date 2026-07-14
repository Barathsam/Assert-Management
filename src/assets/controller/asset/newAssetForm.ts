import type { Response } from 'express'
import { today } from '../../../common/format/parseFormDate'
import { findActiveBranches } from '../../../masters/models/branch/findActiveBranches'
import { findActiveCategories } from '../../../masters/models/category/findActiveCategories'
import type { TxRequest } from '../../../transactionMiddleware'

export const newAssetFormController = async (_req: TxRequest, res: Response) => {
    const [categories, branches] = await Promise.all([findActiveCategories(), findActiveBranches()])
    res.render('assets/form', { title: 'Add Asset', asset: null, categories, branches, today: today() })
}
