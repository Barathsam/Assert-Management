import type { Response } from 'express'
import { UniqueConstraintError } from 'sequelize'
import { BusinessRuleError } from '../../../common/errors/businessRuleError'
import type { TxRequest } from '../../../transactionMiddleware'
import { updateAssetFields } from '../../models/asset/updateAssetFields'
import type { AssetFields } from '../../types/assetInput'

const friendly = (error: unknown, serialNumber: string): Error =>
    error instanceof UniqueConstraintError
        ? new BusinessRuleError(`Serial number "${serialNumber}" is already registered.`)
        : (error as Error)

const notFound = (req: TxRequest, res: Response) => {
    req.flash('error', 'Asset not found.')
    res.redirect('/assets')
}

export const updateAssetController = async (req: TxRequest, res: Response) => {
    const fields = req.body as AssetFields
    const asset = await updateAssetFields(req.params.id as string, fields).catch((error) => {
        throw friendly(error, fields.serialNumber)
    })
    if (!asset) return notFound(req, res)
    req.flash('success', `${asset.assetTag} updated.`)
    res.redirect(`/assets/${asset.id}`)
}
