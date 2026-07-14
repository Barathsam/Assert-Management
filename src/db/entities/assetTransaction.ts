import {
    DataTypes,
    Model,
    type CreationOptional,
    type InferAttributes,
    type InferCreationAttributes,
    type NonAttribute
} from 'sequelize'
import { sequelize } from '../sequelize'
import { ASSET_STATUSES, type AssetStatus } from '../../common/types/assetStatus'
import { TXN_TYPES, type TxnType } from '../../common/types/txnType'
import { RETURN_REASONS, type ReturnReason } from '../../common/types/returnReason'
import type { Asset } from './asset'
import type { Employee } from './employee'
import type { Branch } from './branch'

export class AssetTransaction extends Model<
    InferAttributes<AssetTransaction>,
    InferCreationAttributes<AssetTransaction>
> {
    declare id: CreationOptional<number>
    declare assetId: number
    declare txnType: TxnType
    declare txnAt: Date
    declare fromStatus: AssetStatus | null
    declare toStatus: AssetStatus
    declare employeeId: number | null
    declare branchId: number
    declare returnReason: ReturnReason | null
    declare amount: string | null
    declare vendor: string | null
    declare remarks: string | null
    declare performedBy: CreationOptional<string>
    declare createdAt: CreationOptional<Date>
    declare asset?: NonAttribute<Asset>
    declare employee?: NonAttribute<Employee>
    declare branch?: NonAttribute<Branch>
}

AssetTransaction.init(
    {
        id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        assetId: { type: DataTypes.BIGINT, allowNull: false },
        txnType: { type: DataTypes.ENUM(...TXN_TYPES), allowNull: false },
        txnAt: { type: DataTypes.DATE, allowNull: false },
        fromStatus: DataTypes.ENUM(...ASSET_STATUSES),
        toStatus: { type: DataTypes.ENUM(...ASSET_STATUSES), allowNull: false },
        employeeId: DataTypes.INTEGER,
        branchId: { type: DataTypes.INTEGER, allowNull: false },
        returnReason: DataTypes.ENUM(...RETURN_REASONS),
        amount: DataTypes.DECIMAL(12, 2),
        vendor: DataTypes.STRING(120),
        remarks: DataTypes.TEXT,
        performedBy: { type: DataTypes.STRING(80), allowNull: false, defaultValue: 'system' },
        createdAt: DataTypes.DATE
    },
    { sequelize, tableName: 'asset_transactions', modelName: 'AssetTransaction', timestamps: true, updatedAt: false }
)
