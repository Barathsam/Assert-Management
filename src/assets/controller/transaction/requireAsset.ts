import { BusinessRuleError } from '../../../common/errors/businessRuleError'
import { STATUS_LABEL } from '../../../common/labels/labels'
import type { AssetStatus } from '../../../common/types/assetStatus'
import { findActiveAssetById } from '../../models/asset/findActiveAssetById'

const wrongState = (assetTag: string, status: AssetStatus, expected: readonly AssetStatus[]) =>
    new BusinessRuleError(
        `${assetTag} is ${STATUS_LABEL[status]} — this action needs it to be ${expected
            .map((s) => STATUS_LABEL[s])
            .join(' or ')}.`
    )

export const requireAsset = async (id: string, expected: readonly AssetStatus[]) => {
    const asset = await findActiveAssetById(id)
    if (!asset) throw new BusinessRuleError('Asset not found, or it has been scrapped.')
    const status = asset.status as AssetStatus
    if (!expected.includes(status)) throw wrongState(asset.assetTag, status, expected)
    return asset
}
