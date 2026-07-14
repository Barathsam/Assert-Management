import {
    Model,
    type CreationOptional,
    type InferAttributes,
    type InferCreationAttributes,
    type NonAttribute
} from 'sequelize'
import type { AssetStatus } from '../../common/types/assetStatus'
import type { AssetCategory } from './assetCategory'
import type { Branch } from './branch'
import type { Employee } from './employee'

export abstract class AssetBase<M extends Model> extends Model<InferAttributes<M>, InferCreationAttributes<M>> {
    declare id: CreationOptional<number>
    declare assetTag: CreationOptional<string>
    declare serialNumber: string
    declare categoryId: number
    declare branchId: number
    declare make: string
    declare model: string
    declare specification: string | null
    declare status: CreationOptional<AssetStatus>
    declare currentHolderId: number | null
    declare purchaseDate: string
    declare purchaseCost: string
    declare vendor: string | null
    declare invoiceNo: string | null
    declare warrantyExpiry: string | null
    declare scrapValue: string | null
    declare scrappedAt: Date | null
    declare scrapReason: string | null
    declare notes: string | null
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
    declare category?: NonAttribute<AssetCategory>
    declare branch?: NonAttribute<Branch>
    declare holder?: NonAttribute<Employee>
}
