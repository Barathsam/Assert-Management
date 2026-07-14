import type { Transaction } from 'sequelize'
import { BusinessRuleError } from '../../common/errors/businessRuleError'
import type { ScrapInput } from '../types/scrapInput'
import { returnAsset } from './returnAsset'

const MISSING_REASON =
    'This asset is still issued. A return reason is required so we record who returned it and why before it is written off.'

export const returnBeforeScrap = async (assetId: number, input: ScrapInput, tx: Transaction) => {
    if (!input.returnReason) throw new BusinessRuleError(MISSING_REASON)
    await returnAsset(
        assetId,
        { reason: input.returnReason, txnAt: input.txnAt, remarks: 'Returned for scrapping' },
        tx
    )
}
