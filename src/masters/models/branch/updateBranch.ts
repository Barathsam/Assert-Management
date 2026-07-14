import type { Transaction } from 'sequelize'
import type { Branch } from '../../../db/entities'
import type { BranchFields } from '../../types/masterTypes'

export const updateBranch = (branch: Branch, data: BranchFields, tx?: Transaction) =>
    branch.update({ ...data, code: data.code.toUpperCase() }, { transaction: tx })
