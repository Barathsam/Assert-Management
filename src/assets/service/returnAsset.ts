import type { Transaction } from 'sequelize'
import { BusinessRuleError } from '../../common/errors/businessRuleError'
import type { AssetStatus } from '../../common/types/assetStatus'
import type { ReturnReason } from '../../common/types/returnReason'
import { findAssetById } from '../models/asset/findAssetById'
import { returnTarget } from '../domain/lifecycle/returnTarget'
import { applyTransition } from './applyTransition'

interface ReturnInput {
    reason: ReturnReason
    txnAt: Date
    remarks?: string | null
}

export const returnAsset = async (
    assetId: number,
    input: ReturnInput,
    tx: Transaction
): Promise<{ assetTag: string; assetId: number; toStatus: AssetStatus }> => {
    const current = await findAssetById(assetId, tx)
    if (!current) throw new BusinessRuleError('Asset not found.')
    const toStatus = returnTarget(input.reason)
    const asset = await applyTransition(
        {
            assetId,
            action: 'RETURN',
            toStatus,
            ledger: {
                txnType: 'RETURN',
                txnAt: input.txnAt,
                employeeId: current.currentHolderId,
                returnReason: input.reason,
                remarks: input.remarks
            },
            mutate: (a) => {
                a.currentHolderId = null
            }
        },
        tx
    )
    return { assetTag: asset.assetTag, assetId: asset.id, toStatus }
}
