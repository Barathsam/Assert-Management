import { AssetCategory, Branch, Employee } from '../../../db/entities'

export const assetIncludes = [
    { model: AssetCategory, as: 'category' },
    { model: Branch, as: 'branch' },
    { model: Employee, as: 'holder' }
]
