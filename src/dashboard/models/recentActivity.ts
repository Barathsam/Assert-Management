import { Asset, AssetTransaction, Employee } from '../../db/entities'

export const recentActivity = (): Promise<AssetTransaction[]> =>
    AssetTransaction.findAll({
        include: [
            { model: Asset, as: 'asset' },
            { model: Employee, as: 'employee' }
        ],
        order: [
            ['txnAt', 'DESC'],
            ['id', 'DESC']
        ],
        limit: 12
    })
