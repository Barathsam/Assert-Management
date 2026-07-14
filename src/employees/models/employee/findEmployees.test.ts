import { createAsset } from '../../../common/models/testFactory/createAsset'
import { createBranchTest } from '../../../masters/models/testFactory/createBranch'
import { createCategoryTest } from '../../../masters/models/testFactory/createCategory'
import { createEmployeeTest } from '../testFactory/createEmployee'
import { setActive } from './setActive'
import { findEmployees } from './findEmployees'

const second = { employeeCode: 'EMP0002', email: 'b@example.com', firstName: 'Bala' }

describe('findEmployees', () => {
    test('should return every employee matching the where clause, ordered by employee code', async () => {
        const first = await createEmployeeTest({ employeeCode: 'EMP0009' })
        await createEmployeeTest({ ...second, branchId: first.branchId })
        const actual = await findEmployees({})
        expect(actual.map((e) => e.employeeCode)).toEqual(['EMP0002', 'EMP0009'])
    })

    test('should honour an isActive clause', async () => {
        const first = await createEmployeeTest()
        await setActive(first, false, '2026-01-01')
        await createEmployeeTest({ ...second, branchId: first.branchId })
        const actual = await findEmployees({ isActive: true })
        expect(actual.map((e) => e.employeeCode)).toEqual(['EMP0002'])
    })

    test('should include the branch each employee belongs to', async () => {
        await createEmployeeTest()
        const actual = await findEmployees({})
        expect(actual[0]?.branch?.name).toBe('Bangalore HQ')
    })

    test('should include the assets an employee currently holds', async () => {
        const employee = await createEmployeeTest()
        const category = await createCategoryTest()
        await createAsset({
            assetTag: 'LAP-BLR-000001',
            categoryId: category.id,
            branchId: employee.branchId,
            status: 'ISSUED',
            currentHolderId: employee.id
        })
        const actual = await findEmployees({})
        expect(actual[0]?.heldAssets).toHaveLength(1)
    })

    test('should report no held assets for an employee holding nothing', async () => {
        const employee = await createEmployeeTest()
        await createBranchTest({ code: 'MAA', name: 'Chennai' })
        const actual = await findEmployees({ branchId: employee.branchId })
        expect(actual[0]?.heldAssets).toEqual([])
    })
})
