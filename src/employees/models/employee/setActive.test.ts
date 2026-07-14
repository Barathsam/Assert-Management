import { createEmployeeTest } from '../testFactory/createEmployee'
import { setActive } from './setActive'

describe('setActive', () => {
    test('should deactivate the employee and record the exit date', async () => {
        const employee = await createEmployeeTest()
        const actual = await setActive(employee, false, '2026-03-01')
        expect(actual.isActive).toBe(false)
        expect(actual.dateOfExit).toBe('2026-03-01')
    })

    test('should reactivate the employee and clear the exit date', async () => {
        const employee = await createEmployeeTest()
        await setActive(employee, false, '2026-03-01')
        const actual = await setActive(employee, true, null)
        expect(actual.isActive).toBe(true)
        expect(actual.dateOfExit).toBeNull()
    })
})
