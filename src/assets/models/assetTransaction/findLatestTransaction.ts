import type { Transaction } from 'sequelize'
import { AssetTransaction } from '../../../db/entities'

export const findLatestTransaction = (assetId: number, tx?: Transaction) =>
    AssetTransaction.findOne({
        where: { assetId },
        order: [
            ['txnAt', 'DESC'],
            ['id', 'DESC']
        ],
        transaction: tx
    })
