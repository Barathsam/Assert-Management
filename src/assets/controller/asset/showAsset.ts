import type { Response } from 'express'
import type { TxRequest } from '../../../transactionMiddleware'
import { findActiveAssetById } from '../../models/asset/findActiveAssetById'

export const showAssetController = async (req: TxRequest, res: Response) => {
    const asset = await findActiveAssetById(req.params.id as string)
    if (!asset) {
        req.flash('error', 'Asset not found (it may have been scrapped — see Reports).')
        return res.redirect('/assets')
    }
    res.render('assets/detail', { title: asset.assetTag, asset })
}
