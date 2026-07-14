import { Asset, AssetCategory, Branch } from '../../db/entities'

export const scrappedAssets = (): Promise<Asset[]> =>
    Asset.findAll({
        where: { status: 'SCRAPPED' },
        include: [
            { model: AssetCategory, as: 'category' },
            { model: Branch, as: 'branch' }
        ],
        order: [['scrappedAt', 'DESC']]
    })
