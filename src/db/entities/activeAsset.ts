import { sequelize } from '../sequelize'
import { AssetBase } from './assetBase'
import { assetColumns } from './assetColumns'

export class ActiveAsset extends AssetBase<ActiveAsset> {}

ActiveAsset.init(assetColumns, {
    sequelize,
    tableName: 'assets_active',
    modelName: 'ActiveAsset',
    timestamps: true
})
