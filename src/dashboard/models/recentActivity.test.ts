import { createAsset } from '../../common/models/testFactory/createAsset'
import { createTxn } from '../../common/models/testFactory/createTxn'
import { createEmployeeTest } from '../../employees/models/testFactory/createEmployee'
import { createBranchTest } from '../../masters/models/testFactory/createBranch'
import { createCategoryTest } from '../../masters/models/testFactory/createCategory'
import { recentActivity } from './recentActivity'

const arrange = async () => {
    const branch = await createBranchTest()
    const category = await createCategoryTest()
    const employee = await createEmployeeTest({ branchId: branch.id })
    const asset = await createAsset({ assetTag: 'A1', branchId: branch.id, categoryId: category.id })
    return { employeeId: employee.id, at: { assetId: asset.id, branchId: branch.id } }
}

const purchaseOn = (day: number) => new Date(`2024-01-${String(day).padStart(2, '0')}T00:00:00Z`)

describe('recentActivity', () => {
    test('is empty when nothing has happened', async () => {
        expect(await recentActivity()).toEqual([])
    })

    test('keeps only the twelve most recent events, newest first', async () => {
        const { at } = await arrange()
        const days = Array.from({ length: 15 }, (_, index) => index + 1)
        await Promise.all(
            days.map((day) => createTxn({ ...at, txnType: 'PURCHASE', toStatus: 'IN_STOCK', txnAt: purchaseOn(day) }))
        )

        const recent = await recentActivity()

        expect(recent).toHaveLength(12)
        expect(recent[0]?.txnAt).toEqual(purchaseOn(15))
        expect(recent[11]?.txnAt).toEqual(purchaseOn(4))
    })

    test('joins the asset and the employee onto each event', async () => {
        const { employeeId, at } = await arrange()
        await createTxn({ ...at, txnType: 'ISSUE', fromStatus: 'IN_STOCK', toStatus: 'ISSUED', employeeId })

        const [row] = await recentActivity()

        expect(row).toMatchObject({ asset: { assetTag: 'A1' }, employee: { lastName: 'Menon' } })
    })
})
