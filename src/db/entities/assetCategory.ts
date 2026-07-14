import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from 'sequelize'
import { sequelize } from '../sequelize'

export class AssetCategory extends Model<InferAttributes<AssetCategory>, InferCreationAttributes<AssetCategory>> {
    declare id: CreationOptional<number>
    declare code: string
    declare name: string
    declare description: string | null
    declare isActive: CreationOptional<boolean>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

AssetCategory.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        code: { type: DataTypes.STRING(8), allowNull: false, unique: true },
        name: { type: DataTypes.STRING(80), allowNull: false, unique: true },
        description: DataTypes.TEXT,
        isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    { sequelize, tableName: 'asset_categories', modelName: 'AssetCategory' }
)
