import type { Transaction } from 'sequelize'
import { BusinessRuleError } from '../../common/errors/businessRuleError'
import { findAssetById } from '../models/asset/findAssetById'
import type { ScrapInput } from '../types/scrapInput'
import { applyTransition } from './applyTransition'
import { returnBeforeScrap } from './returnBeforeScrap'

const scrap = (assetId: number, input: ScrapInput, tx: Transaction) =>
    applyTransition(
        {
            assetId,
            action: 'SCRAP',
            toStatus: 'SCRAPPED',
            ledger: {
                txnType: 'SCRAP',
                txnAt: input.txnAt,
                amount: input.scrapValue,
                remarks: input.remarks ?? input.reason
            },
            mutate: (asset) => {
                asset.scrappedAt = input.txnAt
                asset.scrapValue = String(input.scrapValue)
                asset.scrapReason = input.reason
            }
        },
        tx
    )

export const scrapAsset = async (assetId: number, input: ScrapInput, tx: Transaction) => {
    const current = await findAssetById(assetId, tx)
    if (!current) throw new BusinessRuleError('Asset not found.')
    await (current.status === 'ISSUED' ? returnBeforeScrap(assetId, input, tx) : Promise.resolve())
    return scrap(assetId, input, tx)
}
