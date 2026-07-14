import { createAsset } from '../../common/models/testFactory/createAsset'
import { createEmployeeTest } from '../../employees/models/testFactory/createEmployee'
import { createBranchTest } from '../../masters/models/testFactory/createBranch'
import { createCategoryTest } from '../../masters/models/testFactory/createCategory'
import { dashboardStats } from './dashboardStats'

const arrange = async () => {
    const branch = await createBranchTest()
    const category = await createCategoryTest()
    const holder = await createEmployeeTest({ branchId: branch.id })
    return { at: { branchId: branch.id, categoryId: category.id }, holder }
}

describe('dashboardStats', () => {
    test('is all zeroes on an empty database', async () => {
        expect(await dashboardStats()).toEqual({
            totalAssets: 0,
            inStock: 0,
            issued: 0,
            inRepair: 0,
            scrapped: 0,
            totalValue: 0,
            activeEmployees: 0
        })
    })

    test('counts each status and excludes scrapped from the total count and the value', async () => {
        const { at, holder } = await arrange()
        await createAsset({ assetTag: 'A1', ...at, purchaseCost: '82000.00' })
        await createAsset({
            assetTag: 'A2',
            ...at,
            purchaseCost: '4500.50',
            status: 'ISSUED',
            currentHolderId: holder.id
        })
        await createAsset({ assetTag: 'A3', ...at, purchaseCost: '1000.00', status: 'IN_REPAIR' })
        await createAsset({
            assetTag: 'A4',
            ...at,
            purchaseCost: '99999.00',
            status: 'SCRAPPED',
            scrappedAt: new Date('2024-06-01T00:00:00Z')
        })

        expect(await dashboardStats()).toEqual({
            totalAssets: 3,
            inStock: 1,
            issued: 1,
            inRepair: 1,
            scrapped: 1,
            totalValue: 87500.5,
            activeEmployees: 1
        })
    })

    test('counts only active employees', async () => {
        const { holder } = await arrange()
        await holder.update({ isActive: false })

        expect((await dashboardStats()).activeEmployees).toBe(0)
    })
})
