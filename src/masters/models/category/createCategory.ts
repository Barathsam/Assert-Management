import type { Transaction } from 'sequelize'
import { AssetCategory } from '../../../db/entities'
import type { CategoryFields } from '../../types/masterTypes'

export const createCategory = (data: CategoryFields, tx?: Transaction) =>
    AssetCategory.create({ ...data, code: data.code.toUpperCase() }, { transaction: tx })
