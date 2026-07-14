import { DataTypes } from 'sequelize'
import { ASSET_STATUSES, type AssetStatus } from '../../common/types/assetStatus'

export const assetColumns = {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    assetTag: { type: DataTypes.STRING(32), allowNull: false, unique: true },
    serialNumber: { type: DataTypes.STRING(120), allowNull: false },
    categoryId: { type: DataTypes.INTEGER, allowNull: false },
    branchId: { type: DataTypes.INTEGER, allowNull: false },
    make: { type: DataTypes.STRING(80), allowNull: false },
    model: { type: DataTypes.STRING(80), allowNull: false },
    specification: DataTypes.TEXT,
    status: {
        type: DataTypes.ENUM(...ASSET_STATUSES),
        allowNull: false,
        defaultValue: 'IN_STOCK' as AssetStatus
    },
    currentHolderId: DataTypes.INTEGER,
    purchaseDate: { type: DataTypes.DATEONLY, allowNull: false },
    purchaseCost: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    vendor: DataTypes.STRING(120),
    invoiceNo: DataTypes.STRING(64),
    warrantyExpiry: DataTypes.DATEONLY,
    scrapValue: DataTypes.DECIMAL(12, 2),
    scrappedAt: DataTypes.DATE,
    scrapReason: DataTypes.TEXT,
    notes: DataTypes.TEXT,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
} as const
