import type { Transaction } from 'sequelize'
import { Branch, Employee } from '../../../db/entities'

export const findActiveEmployees = (tx?: Transaction) =>
    Employee.findAll({
        where: { isActive: true },
        include: [{ model: Branch, as: 'branch' }],
        order: [['firstName', 'ASC']],
        transaction: tx
    })
