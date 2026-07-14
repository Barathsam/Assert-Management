import { createEmployeeTest } from '../testFactory/createEmployee'
import { setActive } from './setActive'
import { findActiveEmployees } from './findActiveEmployees'

const second = { employeeCode: 'EMP0002', email: 'b@example.com', firstName: 'Bala' }

describe('findActiveEmployees', () => {
    test('should return only the active employees', async () => {
        const leaver = await createEmployeeTest()
        await setActive(leaver, false, '2026-01-01')
        await createEmployeeTest({ ...second, branchId: leaver.branchId })
        const actual = await findActiveEmployees()
        expect(actual.map((e) => e.employeeCode)).toEqual(['EMP0002'])
    })

    test('should order the employees by first name', async () => {
        const first = await createEmployeeTest()
        await createEmployeeTest({ ...second, branchId: first.branchId })
        const actual = await findActiveEmployees()
        expect(actual.map((e) => e.firstName)).toEqual(['Asha', 'Bala'])
    })

    test('should include the branch so the issue dropdown can name it', async () => {
        await createEmployeeTest()
        const actual = await findActiveEmployees()
        expect(actual[0]?.branch?.name).toBe('Bangalore HQ')
    })
})
