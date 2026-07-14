export interface AssetFields {
    serialNumber: string
    categoryId: number
    branchId: number
    make: string
    model: string
    specification?: string | null
    vendor?: string | null
    invoiceNo?: string | null
    warrantyExpiry?: string | null
    notes?: string | null
}

export interface CreateAssetInput extends AssetFields {
    purchaseDate: string
    purchaseCost: string
}
