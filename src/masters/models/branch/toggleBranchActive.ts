import type { Transaction } from 'sequelize'
import type { Branch } from '../../../db/entities'

export const toggleBranchActive = (branch: Branch, tx?: Transaction) =>
    branch.update({ isActive: !branch.isActive }, { transaction: tx })
