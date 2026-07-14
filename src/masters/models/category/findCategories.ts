import type { Transaction } from 'sequelize'
import { AssetCategory } from '../../../db/entities'

export const findCategories = (tx?: Transaction) => AssetCategory.findAll({ order: [['name', 'ASC']], transaction: tx })
