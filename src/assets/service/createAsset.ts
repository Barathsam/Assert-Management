import type { Transaction } from 'sequelize'
import { parseFormDate } from '../../common/format/parseFormDate'
import { insertAsset } from '../models/asset/insertAsset'
import { nextAssetTag } from '../models/asset/nextAssetTag'
import { createTransaction } from '../models/assetTransaction/createTransaction'
import type { CreateAssetInput } from '../types/assetInput'

const purchaseRow = (assetId: number, input: CreateAssetInput) => ({
    assetId,
    txnType: 'PURCHASE' as const,
    txnAt: parseFormDate(input.purchaseDate, new Date()),
    fromStatus: null,
    toStatus: 'IN_STOCK' as const,
    branchId: input.branchId,
    amount: input.purchaseCost,
    vendor: input.vendor ?? null,
    remarks: input.invoiceNo ? `Invoice ${input.invoiceNo}` : null
})

export const createAsset = async (input: CreateAssetInput, tx: Transaction) => {
    const tag = await nextAssetTag(input.categoryId, input.branchId, tx)
    const asset = await insertAsset(input, tag, tx)
    await createTransaction(purchaseRow(asset.id, input), tx)
    return asset
}
