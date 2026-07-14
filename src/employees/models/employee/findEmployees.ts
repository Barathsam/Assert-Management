import type { Transaction, WhereOptions } from 'sequelize'
import { ActiveAsset, Branch, Employee } from '../../../db/entities'

export const findEmployees = (where: WhereOptions, tx?: Transaction) =>
    Employee.findAll({
        where,
        include: [
            { model: Branch, as: 'branch' },
            { model: ActiveAsset, as: 'heldAssets' }
        ],
        order: [['employeeCode', 'ASC']],
        transaction: tx
    })
