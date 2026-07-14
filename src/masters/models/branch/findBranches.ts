import type { Transaction } from 'sequelize'
import { Branch } from '../../../db/entities'

export const findBranches = (tx?: Transaction) => Branch.findAll({ order: [['name', 'ASC']], transaction: tx })
