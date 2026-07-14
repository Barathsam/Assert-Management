import { ActiveAsset } from '../../../db/entities'
import type { AssetFields } from '../../types/assetInput'

export const updateAssetFields = async (id: number | string, fields: AssetFields) => {
    const asset = await ActiveAsset.findByPk(id)
    return asset ? asset.update(fields) : null
}
