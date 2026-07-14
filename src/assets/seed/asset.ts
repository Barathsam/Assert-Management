import { faker } from '@faker-js/faker'
import type { CreateAssetInput } from '../types/assetInput'

export const seedAssetData: CreateAssetInput = {
    serialNumber: 'SN-SEED-0001',
    categoryId: 1,
    branchId: 1,
    make: 'Dell',
    model: 'Latitude 5420',
    specification: 'i5 / 16GB / 512GB',
    purchaseDate: '2024-01-10',
    purchaseCost: '82000.00',
    vendor: 'Redington',
    invoiceNo: 'INV/2024/1',
    warrantyExpiry: '2027-01-09',
    notes: null
}

export const dynamicAsset = (): CreateAssetInput => ({
    ...seedAssetData,
    serialNumber: `SN-${faker.string.alphanumeric(10).toUpperCase()}`
})
