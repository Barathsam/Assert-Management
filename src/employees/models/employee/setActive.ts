import type { Transaction } from 'sequelize'
import type { Employee } from '../../../db/entities'

export const setActive = (employee: Employee, isActive: boolean, dateOfExit: string | null, tx?: Transaction) =>
    employee.update({ isActive, dateOfExit }, { transaction: tx })
