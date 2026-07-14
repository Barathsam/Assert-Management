import type { Transaction } from 'sequelize'
import { Branch } from '../../../db/entities'

export const findBranchById = (id: number, tx?: Transaction) => Branch.findByPk(id, { transaction: tx })
