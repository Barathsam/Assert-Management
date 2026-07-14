import type { Transaction } from 'sequelize'
import { blankToNull, orNull } from '../../../common/format/nullable'
import { Asset } from '../../../db/entities'
import type { CreateAssetInput } from '../../types/assetInput'

const optionalFields = (input: CreateAssetInput) => ({
    specification: orNull(input.specification),
    vendor: orNull(input.vendor),
    invoiceNo: orNull(input.invoiceNo),
    warrantyExpiry: blankToNull(input.warrantyExpiry),
    notes: orNull(input.notes)
})

export const insertAsset = (input: CreateAssetInput, assetTag: string, tx: Transaction) =>
    Asset.create(
        {
            ...input,
            ...optionalFields(input),
            assetTag,
            status: 'IN_STOCK',
            currentHolderId: null,
            scrapValue: null,
            scrappedAt: null,
            scrapReason: null
        },
        { transaction: tx }
    )
