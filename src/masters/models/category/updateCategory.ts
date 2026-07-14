import type { Transaction } from 'sequelize'
import type { AssetCategory } from '../../../db/entities'
import type { CategoryFields } from '../../types/masterTypes'

export const updateCategory = (category: AssetCategory, data: CategoryFields, tx?: Transaction) =>
    category.update({ ...data, code: data.code.toUpperCase() }, { transaction: tx })
