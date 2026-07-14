import { createAsset } from '../../common/models/testFactory/createAsset'
import { createTxn } from '../../common/models/testFactory/createTxn'
import { createEmployeeTest } from '../../employees/models/testFactory/createEmployee'
import { createBranchTest } from '../../masters/models/testFactory/createBranch'
import { createCategoryTest } from '../../masters/models/testFactory/createCategory'
import { ledgerRows } from './ledgerRows'

const arrange = async () => {
    const branch = await createBranchTest({ code: 'MAA', name: 'Chennai' })
    const category = await createCategoryTest()
    const employee = await createEmployeeTest({ branchId: branch.id })
    const asset = await createAsset({ assetTag: 'A1', branchId: branch.id, categoryId: category.id })
    return { employeeId: employee.id, at: { assetId: asset.id, branchId: branch.id } }
}

describe('ledgerRows', () => {
    test('is empty when nothing has happened', async () => {
        expect(await ledgerRows()).toEqual([])
    })

    test('returns every transaction newest first', async () => {
        const { employeeId, at } = await arrange()
        await createTxn({ ...at, txnType: 'PURCHASE', toStatus: 'IN_STOCK', txnAt: new Date('2024-01-01T00:00:00Z') })
        await createTxn({
            ...at,
            txnType: 'ISSUE',
            fromStatus: 'IN_STOCK',
            toStatus: 'ISSUED',
            employeeId,
            txnAt: new Date('2024-02-01T00:00:00Z')
        })

        const rows = await ledgerRows()

        expect(rows.map((row) => row.txnType)).toEqual(['ISSUE', 'PURCHASE'])
    })

    test('joins the asset, the employee and the branch onto each row', async () => {
        const { employeeId, at } = await arrange()
        await createTxn({ ...at, txnType: 'ISSUE', fromStatus: 'IN_STOCK', toStatus: 'ISSUED', employeeId })

        const [row] = await ledgerRows()

        expect(row).toMatchObject({
            asset: { assetTag: 'A1' },
            employee: { firstName: 'Asha' },
            branch: { name: 'Chennai' }
        })
    })
})
