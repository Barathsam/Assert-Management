import { AssetTransaction, Employee } from '../../db/entities'

export const historyTimeline = (assetId: number): Promise<AssetTransaction[]> =>
    AssetTransaction.findAll({
        where: { assetId },
        include: [{ model: Employee, as: 'employee' }],
        order: [
            ['txnAt', 'ASC'],
            ['id', 'ASC']
        ]
    })
