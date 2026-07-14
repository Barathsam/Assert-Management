import type { Transaction } from 'sequelize'
import { Branch } from '../../../db/entities'
import type { BranchFields } from '../../types/masterTypes'

export const createBranch = (data: BranchFields, tx?: Transaction) =>
    Branch.create({ ...data, code: data.code.toUpperCase() }, { transaction: tx })
