import { sequelize } from '../sequelize'
import { AssetBase } from './assetBase'
import { assetColumns } from './assetColumns'

export class Asset extends AssetBase<Asset> {}

const normaliseSerial = (instance: Asset): void => {
    instance.serialNumber = instance.serialNumber?.trim().toUpperCase()
}

Asset.init(assetColumns, {
    sequelize,
    tableName: 'assets',
    modelName: 'Asset',
    hooks: { beforeValidate: normaliseSerial }
})
