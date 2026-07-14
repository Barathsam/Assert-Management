import { Asset } from '../../../db/entities'
import type { AssetStatus } from '../../types/assetStatus'

export interface AssetOverrides {
    assetTag: string
    categoryId: number
    branchId: number
    serialNumber?: string
    status?: AssetStatus
    currentHolderId?: number | null
    purchaseDate?: string
    purchaseCost?: string
    scrapValue?: string | null
    scrappedAt?: Date | null
    scrapReason?: string | null
}

export const createAsset = (overrides: AssetOverrides) =>
    Asset.create({
        serialNumber: overrides.assetTag,
        make: 'Dell',
        model: 'Latitude',
        specification: null,
        currentHolderId: null,
        purchaseDate: '2024-01-01',
        purchaseCost: '50000.00',
        vendor: null,
        invoiceNo: null,
        warrantyExpiry: null,
        scrapValue: null,
        scrappedAt: null,
        scrapReason: null,
        notes: null,
        ...overrides
    })
