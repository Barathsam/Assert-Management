import type { Transaction } from 'sequelize'
import { Branch } from '../../../db/entities'

export const findActiveBranches = (tx?: Transaction) =>
    Branch.findAll({ where: { isActive: true }, order: [['name', 'ASC']], transaction: tx })
