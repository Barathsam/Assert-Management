import type { Response } from 'express'
import type { TxRequest } from '../../../transactionMiddleware'
import { findCategories } from '../../models/category/findCategories'

export const listCategories = async (req: TxRequest, res: Response) => {
    const categories = await findCategories(req.transactionClient)
    res.render('categories/index', { title: 'Asset Categories', categories })
}
