import type { Transaction } from 'sequelize'
import { Employee } from '../../../db/entities'

export const findEmployeeById = (id: number, tx?: Transaction) => Employee.findByPk(id, { transaction: tx })
