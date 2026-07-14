import { createAsset } from '../../../common/models/testFactory/createAsset'
import type { Employee } from '../../../db/entities'
import { createCategoryTest } from '../../../masters/models/testFactory/createCategory'
import { createEmployeeTest } from '../testFactory/createEmployee'
import { findEmployeeWithHeldAssets } from './findEmployeeWithHeldAssets'

const issueTo = async (employeeId: number, branchId: number, assetTag: string) => {
    const category = await createCategoryTest({ code: assetTag, name: assetTag })
    return createAsset({ assetTag, categoryId: category.id, branchId, status: 'ISSUED', currentHolderId: employeeId })
}

const heldOf = (employee: Employee | null) => employee?.heldAssets ?? []

describe('findEmployeeWithHeldAssets', () => {
    test('should return the employee with their branch', async () => {
        const employee = await createEmployeeTest()
        const actual = await findEmployeeWithHeldAssets(employee.id)
        expect(actual?.branch?.name).toBe('Bangalore HQ')
    })

    test('should return an empty held-asset list when the employee holds nothing', async () => {
        const employee = await createEmployeeTest()
        expect(heldOf(await findEmployeeWithHeldAssets(employee.id))).toEqual([])
    })

    test('should return every asset the employee currently holds', async () => {
        const employee = await createEmployeeTest()
        await issueTo(employee.id, employee.branchId, 'LAP1')
        await issueTo(employee.id, employee.branchId, 'MOB1')
        const held = heldOf(await findEmployeeWithHeldAssets(employee.id))
        expect(held.map((asset) => asset.assetTag)).toEqual(['LAP1', 'MOB1'])
    })

    test('should include the category of each held asset for the detail page', async () => {
        const employee = await createEmployeeTest()
        await issueTo(employee.id, employee.branchId, 'LAP1')
        const held = heldOf(await findEmployeeWithHeldAssets(employee.id))
        expect(held[0]?.category?.name).toBe('LAP1')
    })

    test('should return null when the employee does not exist', async () => {
        expect(await findEmployeeWithHeldAssets(9999)).toBeNull()
    })
})
