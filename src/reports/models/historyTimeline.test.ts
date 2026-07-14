import { createAsset } from '../../common/models/testFactory/createAsset'
import { createTxn } from '../../common/models/testFactory/createTxn'
import { createEmployeeTest } from '../../employees/models/testFactory/createEmployee'
import { createBranchTest } from '../../masters/models/testFactory/createBranch'
import { createCategoryTest } from '../../masters/models/testFactory/createCategory'
import { historyTimeline } from './historyTimeline'

const arrange = async () => {
    const branch = await createBranchTest()
    const category = await createCategoryTest()
    const employee = await createEmployeeTest({ branchId: branch.id })
    const asset = await createAsset({ assetTag: 'A1', branchId: branch.id, categoryId: category.id })
    const other = await createAsset({ assetTag: 'A2', branchId: branch.id, categoryId: category.id })
    return { asset, other, employeeId: employee.id, branchId: branch.id }
}

describe('historyTimeline', () => {
    test('is empty for an asset with no events', async () => {
        const { asset } = await arrange()

        expect(await historyTimeline(asset.id)).toEqual([])
    })

    test('returns the events of one asset oldest first, with the employee joined', async () => {
        const { asset, employeeId, branchId } = await arrange()
        const at = { assetId: asset.id, branchId }
        await createTxn({
            ...at,
            txnType: 'ISSUE',
            fromStatus: 'IN_STOCK',
            toStatus: 'ISSUED',
            employeeId,
            txnAt: new Date('2024-02-01T00:00:00Z')
        })
        await createTxn({ ...at, txnType: 'PURCHASE', toStatus: 'IN_STOCK', txnAt: new Date('2024-01-01T00:00:00Z') })

        const timeline = await historyTimeline(asset.id)

        expect(timeline.map((row) => row.txnType)).toEqual(['PURCHASE', 'ISSUE'])
        expect(timeline[1]?.employee?.firstName).toBe('Asha')
    })

    test('never shows another asset events', async () => {
        const { asset, other, branchId } = await arrange()
        await createTxn({ assetId: other.id, branchId, txnType: 'PURCHASE', toStatus: 'IN_STOCK' })

        expect(await historyTimeline(asset.id)).toEqual([])
    })
})
