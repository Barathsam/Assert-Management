import { UniqueConstraintError } from 'sequelize'
import { seedEmployeeData } from '../../seed/employee'
import { createEmployeeTest } from '../testFactory/createEmployee'
import { updateEmployee } from './updateEmployee'

describe('updateEmployee', () => {
    test('should overwrite the editable fields', async () => {
        const employee = await createEmployeeTest()
        const actual = await updateEmployee(employee, {
            ...seedEmployeeData,
            branchId: employee.branchId,
            firstName: 'Meera',
            designation: 'Site Supervisor'
        })
        expect(actual.firstName).toBe('Meera')
        expect(actual.designation).toBe('Site Supervisor')
    })

    test('should clear an optional field that is set to null', async () => {
        const employee = await createEmployeeTest()
        const actual = await updateEmployee(employee, {
            ...seedEmployeeData,
            branchId: employee.branchId,
            phone: null
        })
        expect(actual.phone).toBeNull()
    })

    test('should not change the active flag', async () => {
        const employee = await createEmployeeTest()
        const actual = await updateEmployee(employee, { ...seedEmployeeData, branchId: employee.branchId })
        expect(actual.isActive).toBe(true)
    })

    test('should reject an employee code that another employee already uses', async () => {
        const first = await createEmployeeTest()
        const second = await createEmployeeTest({
            branchId: first.branchId,
            employeeCode: 'EMP0002',
            email: 'second@example.com'
        })
        const clash = updateEmployee(second, {
            ...seedEmployeeData,
            branchId: first.branchId,
            employeeCode: first.employeeCode,
            email: 'second@example.com'
        })
        await expect(clash).rejects.toBeInstanceOf(UniqueConstraintError)
    })
})
