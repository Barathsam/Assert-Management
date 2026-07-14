import type { Response } from 'express'
import type { AssetCategory } from '../../../db/entities'
import type { TxRequest } from '../../../transactionMiddleware'
import { createCategory } from '../../models/category/createCategory'
import type { CategoryFields } from '../../types/masterTypes'
import { duplicateCategory } from './duplicateCategory'

const created = (req: TxRequest, category: AssetCategory) => req.flash('success', `Category ${category.name} created.`)

export const createCategoryController = async (req: TxRequest, res: Response) => {
    await createCategory(req.body as CategoryFields, req.transactionClient)
        .then((category) => created(req, category))
        .catch((error: unknown) => duplicateCategory(req, error))
    res.redirect('/categories')
}
