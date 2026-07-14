import type { Response } from 'express'
import type { AssetCategory } from '../../../db/entities'
import type { TxRequest } from '../../../transactionMiddleware'
import { findCategoryById } from '../../models/category/findCategoryById'
import { toggleCategoryActive } from '../../models/category/toggleCategoryActive'

const toggle = (req: TxRequest, category: AssetCategory) =>
    toggleCategoryActive(category, req.transactionClient).then((next) =>
        req.flash('success', `${next.name} ${next.isActive ? 'activated' : 'deactivated'}.`)
    )

export const toggleCategoryController = async (req: TxRequest, res: Response) => {
    const category = await findCategoryById(Number(req.params.id), req.transactionClient)
    if (category) await toggle(req, category)
    res.redirect('/categories')
}
