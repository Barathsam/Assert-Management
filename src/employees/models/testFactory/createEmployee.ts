import { createBranchTest } from '../../../masters/models/testFactory/createBranch'
import { seedEmployeeData } from '../../seed/employee'
import type { EmployeeFields } from '../../types/employeeTypes'
import { createEmployee } from '../employee/createEmployee'

export const createEmployeeTest = async (overrides: Partial<EmployeeFields> = {}) => {
    const branchId = overrides.branchId ?? (await createBranchTest()).id
    return createEmployee({ ...seedEmployeeData, ...overrides, branchId })
}
