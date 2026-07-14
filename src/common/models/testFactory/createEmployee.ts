import { Employee } from '../../../db/entities'

interface EmployeeOverrides {
    employeeCode?: string
    firstName?: string
    lastName?: string
    email?: string | null
    designation?: string | null
    department?: string | null
    branchId?: number
    isActive?: boolean
    dateOfExit?: string | null
}

export const createEmployeeTest = (branchId: number, overrides: EmployeeOverrides = {}) =>
    Employee.create({
        employeeCode: 'EMP0001',
        firstName: 'Priya',
        lastName: 'Sharma',
        designation: 'Senior Engineer',
        branchId,
        ...overrides
    })
