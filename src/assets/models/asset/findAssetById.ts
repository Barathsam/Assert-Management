import type { Transaction } from 'sequelize'
import { Asset } from '../../../db/entities'

export const findAssetById = (id: number, tx?: Transaction) => Asset.findByPk(id, { transaction: tx })
