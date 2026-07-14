import type { Transaction } from 'sequelize'
import type { Employee } from '../../../db/entities'
import type { EmployeeFields } from '../../types/employeeTypes'

export const updateEmployee = (employee: Employee, data: EmployeeFields, tx?: Transaction) =>
    employee.update(data, { transaction: tx })
