import type { Transaction } from 'sequelize'
import { ActiveAsset, AssetCategory, Branch, Employee } from '../../../db/entities'

const heldAssets = {
    model: ActiveAsset,
    as: 'heldAssets',
    include: [
        { model: AssetCategory, as: 'category' },
        { model: Branch, as: 'branch' }
    ]
}

export const findEmployeeWithHeldAssets = (id: number, tx?: Transaction) =>
    Employee.findByPk(id, {
        include: [{ model: Branch, as: 'branch' }, heldAssets],
        transaction: tx
    })
