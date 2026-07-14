import { ActiveAsset } from '../../../db/entities'
import { assetIncludes } from './assetIncludes'

export const findActiveAssetById = (id: number | string) => ActiveAsset.findByPk(id, { include: assetIncludes })
