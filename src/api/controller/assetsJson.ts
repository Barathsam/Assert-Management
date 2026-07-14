import type { Response } from 'express'
import { assetFilters, type AssetQuery } from '../../assets/controller/asset/assetFilters'
import { findActiveAssets } from '../../assets/models/asset/findActiveAssets'
import type { TxRequest } from '../../transactionMiddleware'

export const assetsJsonController = async (req: TxRequest, res: Response) => {
    const assets = await findActiveAssets(assetFilters(req.query as AssetQuery))
    res.json({ data: assets })
}
