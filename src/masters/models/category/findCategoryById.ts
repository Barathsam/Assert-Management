import type { Transaction } from 'sequelize'
import { AssetCategory } from '../../../db/entities'

export const findCategoryById = (id: number, tx?: Transaction) => AssetCategory.findByPk(id, { transaction: tx })
