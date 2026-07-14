import type { Transaction } from 'sequelize'
import { AssetCategory } from '../../../db/entities'

export const findActiveCategories = (tx?: Transaction) =>
    AssetCategory.findAll({ where: { isActive: true }, order: [['name', 'ASC']], transaction: tx })
