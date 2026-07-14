import { createAsset } from '../../common/models/testFactory/createAsset'
import { createEmployeeTest } from '../../employees/models/testFactory/createEmployee'
import { createBranchTest } from '../../masters/models/testFactory/createBranch'
import { createCategoryTest } from '../../masters/models/testFactory/createCategory'
import { stockRows } from './stockRows'

const arrange = async () => {
    const chennai = await createBranchTest({ code: 'MAA', name: 'Chennai' })
    const mumbai = await createBranchTest({ code: 'BOM', name: 'Mumbai' })
    const laptop = await createCategoryTest({ code: 'LAP', name: 'Laptop' })
    const monitor = await createCategoryTest({ code: 'MON', name: 'Monitor' })
    const holder = await createEmployeeTest({ branchId: chennai.id })
    return { chennai, mumbai, laptop, monitor, holder }
}

describe('stockRows', () => {
    test('groups in-stock assets by branch and category, summing value in SQL', async () => {
        const { chennai, laptop } = await arrange()
        await createAsset({ assetTag: 'A1', branchId: chennai.id, categoryId: laptop.id, purchaseCost: '82000.00' })
        await createAsset({ assetTag: 'A2', branchId: chennai.id, categoryId: laptop.id, purchaseCost: '4500.50' })

        const rows = await stockRows({})

        expect(rows).toEqual([
            {
                branchId: chennai.id,
                branchName: 'Chennai',
                categoryId: laptop.id,
                categoryName: 'Laptop',
                qty: 2,
                value: 86500.5
            }
        ])
    })

    test('leaves out issued, in-repair and scrapped assets', async () => {
        const { chennai, laptop, holder } = await arrange()
        const at = { branchId: chennai.id, categoryId: laptop.id }
        await createAsset({ assetTag: 'A1', ...at })
        await createAsset({ assetTag: 'A2', ...at, status: 'ISSUED', currentHolderId: holder.id })
        await createAsset({ assetTag: 'A3', ...at, status: 'IN_REPAIR' })
        await createAsset({ assetTag: 'A4', ...at, status: 'SCRAPPED', scrappedAt: new Date('2024-06-01') })

        const rows = await stockRows({})

        expect(rows).toEqual([expect.objectContaining({ qty: 1 })])
    })

    test('orders by branch then category and keeps branches separate', async () => {
        const { chennai, mumbai, laptop, monitor } = await arrange()
        await createAsset({ assetTag: 'A1', branchId: mumbai.id, categoryId: laptop.id })
        await createAsset({ assetTag: 'A2', branchId: chennai.id, categoryId: monitor.id })
        await createAsset({ assetTag: 'A3', branchId: chennai.id, categoryId: laptop.id })

        const rows = await stockRows({})

        expect(rows.map((row) => [row.branchName, row.categoryName])).toEqual([
            ['Chennai', 'Laptop'],
            ['Chennai', 'Monitor'],
            ['Mumbai', 'Laptop']
        ])
    })

    test('filters by branch and by category', async () => {
        const { chennai, mumbai, laptop, monitor } = await arrange()
        await createAsset({ assetTag: 'A1', branchId: chennai.id, categoryId: laptop.id })
        await createAsset({ assetTag: 'A2', branchId: chennai.id, categoryId: monitor.id })
        await createAsset({ assetTag: 'A3', branchId: mumbai.id, categoryId: laptop.id })

        const byBranch = await stockRows({ branchId: chennai.id })
        const byBoth = await stockRows({ branchId: chennai.id, categoryId: monitor.id })

        expect(byBranch).toHaveLength(2)
        expect(byBoth).toEqual([expect.objectContaining({ categoryName: 'Monitor', qty: 1 })])
    })
})
