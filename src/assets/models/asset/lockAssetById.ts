import { Transaction, type Transactionable } from 'sequelize'
import { Asset } from '../../../db/entities'

export const lockAssetById = (id: number, tx: Transactionable['transaction']) =>
    Asset.findByPk(id, { transaction: tx, lock: Transaction.LOCK.UPDATE })
