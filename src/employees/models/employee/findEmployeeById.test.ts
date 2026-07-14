import { createEmployeeTest } from '../testFactory/createEmployee'
import { findEmployeeById } from './findEmployeeById'

describe('findEmployeeById', () => {
    test('should return the employee when the id is known', async () => {
        const employee = await createEmployeeTest()
        const actual = await findEmployeeById(employee.id)
        expect(actual?.id).toBe(employee.id)
        expect(actual?.employeeCode).toBe('EMP0001')
    })

    test('should return null when the id is unknown', async () => {
        expect(await findEmployeeById(9999)).toBeNull()
    })
})
