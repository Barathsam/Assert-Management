import { Asset, AssetTransaction, Branch, Employee } from '../../db/entities'

export const ledgerRows = (): Promise<AssetTransaction[]> =>
    AssetTransaction.findAll({
        include: [
            { model: Asset, as: 'asset' },
            { model: Employee, as: 'employee' },
            { model: Branch, as: 'branch' }
        ],
        order: [
            ['txnAt', 'DESC'],
            ['id', 'DESC']
        ],
        limit: 1000
    })
