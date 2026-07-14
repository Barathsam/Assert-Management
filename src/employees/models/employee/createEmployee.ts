import type { Transaction } from 'sequelize'
import { Employee } from '../../../db/entities'
import type { EmployeeFields } from '../../types/employeeTypes'

export const createEmployee = (data: EmployeeFields, tx?: Transaction) =>
    Employee.create({ ...data, dateOfExit: null }, { transaction: tx })
