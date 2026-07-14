import type { Response } from 'express'
import type { AssetCategory } from '../../../db/entities'
import type { TxRequest } from '../../../transactionMiddleware'
import { findCategoryById } from '../../models/category/findCategoryById'
import { updateCategory } from '../../models/category/updateCategory'
import type { CategoryFields } from '../../types/masterTypes'
import { duplicateCategory } from './duplicateCategory'

const missing = (req: TxRequest) => req.flash('error', 'Category not found.')

const save = (req: TxRequest, category: AssetCategory) =>
    updateCategory(category, req.body as CategoryFields, req.transactionClient)
        .then((saved) => req.flash('success', `Category ${saved.name} updated.`))
        .catch((error: unknown) => duplicateCategory(req, error))

export const updateCategoryController = async (req: TxRequest, res: Response) => {
    const category = await findCategoryById(Number(req.params.id), req.transactionClient)
    await (category ? save(req, category) : missing(req))
    res.redirect('/categories')
}
