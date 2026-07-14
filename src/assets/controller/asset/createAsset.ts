import type { Response } from 'express'
import { UniqueConstraintError } from 'sequelize'
import { BusinessRuleError } from '../../../common/errors/businessRuleError'
import type { TxRequest } from '../../../transactionMiddleware'
import { createAsset } from '../../service/createAsset'
import type { CreateAssetInput } from '../../types/assetInput'

const friendly = (error: unknown, serialNumber: string): Error =>
    error instanceof UniqueConstraintError
        ? new BusinessRuleError(`Serial number "${serialNumber}" is already registered to another asset.`)
        : (error as Error)

export const createAssetController = async (req: TxRequest, res: Response) => {
    const input = req.body as CreateAssetInput
    const asset = await createAsset(input, req.transactionClient).catch((error) => {
        throw friendly(error, input.serialNumber)
    })
    req.flash('success', `Asset ${asset.assetTag} added to stock.`)
    res.redirect(`/assets/${asset.id}`)
}
