import type { Transaction } from 'sequelize'
import type { AssetCategory } from '../../../db/entities'

export const toggleCategoryActive = (category: AssetCategory, tx?: Transaction) =>
    category.update({ isActive: !category.isActive }, { transaction: tx })
