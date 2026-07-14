import type { Transaction } from 'sequelize'
import { BusinessRuleError } from '../../common/errors/businessRuleError'
import type { AssetStatus } from '../../common/types/assetStatus'
import type { Asset } from '../../db/entities'
import { assertNotBackdated } from '../domain/lifecycle/assertNotBackdated'
import { assertTransition } from '../domain/lifecycle/assertTransition'
import { lockAssetById } from '../models/asset/lockAssetById'
import { createTransaction } from '../models/assetTransaction/createTransaction'
import { findLatestTransaction } from '../models/assetTransaction/findLatestTransaction'
import type { TransitionInput } from '../types/transitionInput'

const writeAsset = async (asset: Asset, input: TransitionInput, tx: Transaction) => {
    input.mutate(asset)
    asset.status = input.toStatus
    await asset.save({ transaction: tx })
}

const writeLedger = (asset: Asset, from: AssetStatus, input: TransitionInput, tx: Transaction) =>
    createTransaction(
        {
            ...input.ledger,
            assetId: input.assetId,
            branchId: asset.branchId,
            fromStatus: from,
            toStatus: input.toStatus
        },
        tx
    )

const guard = async (asset: Asset, input: TransitionInput, tx: Transaction) => {
    const from = asset.status as AssetStatus
    assertTransition(input.action, from, asset.assetTag)
    const latest = await findLatestTransaction(input.assetId, tx)
    assertNotBackdated(input.ledger.txnAt, latest?.txnAt ?? null)
    return from
}

export const applyTransition = async (input: TransitionInput, tx: Transaction): Promise<Asset> => {
    const asset = await lockAssetById(input.assetId, tx)
    if (!asset) throw new BusinessRuleError('Asset not found.')
    const from = await guard(asset, input, tx)
    await writeAsset(asset, input, tx)
    await writeLedger(asset, from, input, tx)
    return asset
}
