import { createAsset } from '../../common/models/testFactory/createAsset'
import { createTxn } from '../../common/models/testFactory/createTxn'
import { createEmployeeTest } from '../../employees/models/testFactory/createEmployee'
import { createBranchTest } from '../../masters/models/testFactory/createBranch'
import { createCategoryTest } from '../../masters/models/testFactory/createCategory'
import { integrityDrift } from './integrityDrift'

const arrange = async () => {
    const branch = await createBranchTest()
    const category = await createCategoryTest()
    const employee = await createEmployeeTest({ branchId: branch.id })
    const asset = await createAsset({ assetTag: 'A1', branchId: branch.id, categoryId: category.id })
    return { at: { assetId: asset.id, branchId: branch.id }, employeeId: employee.id }
}

describe('integrityDrift', () => {
    test('finds no drift when the status matches the last ledger row', async () => {
        const { at } = await arrange()
        await createTxn({ ...at, txnType: 'PURCHASE', toStatus: 'IN_STOCK' })

        expect(await integrityDrift()).toEqual([])
    })

    test('reports an asset whose status disagrees with its most recent ledger row', async () => {
        const { at, employeeId } = await arrange()
        await createTxn({ ...at, txnType: 'PURCHASE', toStatus: 'IN_STOCK' })
        await createTxn({
            ...at,
            txnType: 'ISSUE',
            fromStatus: 'IN_STOCK',
            toStatus: 'ISSUED',
            employeeId,
            txnAt: new Date('2024-02-01T00:00:00Z')
        })

        expect(await integrityDrift()).toEqual([
            expect.objectContaining({ assetTag: 'A1', assetStatus: 'IN_STOCK', ledgerStatus: 'ISSUED' })
        ])
    })

    test('reports an asset with no ledger row at all', async () => {
        await arrange()

        const drift = await integrityDrift()

        expect(drift).toHaveLength(1)
        expect(drift[0]?.ledgerStatus).toBeNull()
    })
})
