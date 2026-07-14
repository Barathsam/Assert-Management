import type { WhereOptions } from 'sequelize'
import { ActiveAsset } from '../../../db/entities'
import { assetIncludes } from './assetIncludes'

export const findActiveAssets = (where: WhereOptions) =>
    ActiveAsset.findAll({ where, include: assetIncludes, order: [['id', 'DESC']] })
