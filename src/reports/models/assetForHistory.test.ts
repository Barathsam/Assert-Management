import { createAsset } from '../../common/models/testFactory/createAsset'
import { createEmployeeTest } from '../../employees/models/testFactory/createEmployee'
import { createBranchTest } from '../../masters/models/testFactory/createBranch'
import { createCategoryTest } from '../../masters/models/testFactory/createCategory'
import { assetForHistory } from './assetForHistory'

const arrange = async () => {
    const branch = await createBranchTest({ code: 'MAA', name: 'Chennai' })
    const category = await createCategoryTest({ code: 'LAP', name: 'Laptop' })
    const employee = await createEmployeeTest({ branchId: branch.id })
    return { branchId: branch.id, categoryId: category.id, employeeId: employee.id }
}

describe('assetForHistory', () => {
    test('is null for an asset that does not exist', async () => {
        expect(await assetForHistory(9999)).toBeNull()
    })

    test('finds a scrapped asset, because reports are the one place it still exists', async () => {
        const { branchId, categoryId } = await arrange()
        const scrapped = await createAsset({
            assetTag: 'DEAD',
            branchId,
            categoryId,
            status: 'SCRAPPED',
            scrappedAt: new Date('2024-06-01T00:00:00Z')
        })

        const asset = await assetForHistory(scrapped.id)

        expect(asset?.assetTag).toBe('DEAD')
        expect(asset?.status).toBe('SCRAPPED')
    })

    test('joins the category, branch and current holder', async () => {
        const { branchId, categoryId, employeeId } = await arrange()
        const issued = await createAsset({
            assetTag: 'A1',
            branchId,
            categoryId,
            status: 'ISSUED',
            currentHolderId: employeeId
        })

        const asset = await assetForHistory(issued.id)

        expect(asset).toMatchObject({
            category: { name: 'Laptop' },
            branch: { name: 'Chennai' },
            holder: { firstName: 'Asha' }
        })
    })
})
