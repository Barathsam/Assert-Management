import { ActiveAsset } from '../../../db/entities'
import type { AssetStatus } from '../../../common/types/assetStatus'
import { assetIncludes } from './assetIncludes'

export const findAssetsByStatus = (status?: AssetStatus) =>
    ActiveAsset.findAll({
        where: status ? { status } : {},
        include: assetIncludes,
        order: [['assetTag', 'ASC']]
    })
