import { Asset, AssetCategory, Branch, Employee } from '../../db/entities'

export const assetForHistory = (assetId: number): Promise<Asset | null> =>
    Asset.findByPk(assetId, {
        include: [
            { model: AssetCategory, as: 'category' },
            { model: Branch, as: 'branch' },
            { model: Employee, as: 'holder' }
        ]
    })
