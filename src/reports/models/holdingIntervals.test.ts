import { createAsset } from '../../common/models/testFactory/createAsset'
import { createTxn } from '../../common/models/testFactory/createTxn'
import { createEmployeeTest } from '../../employees/models/testFactory/createEmployee'
import { createBranchTest } from '../../masters/models/testFactory/createBranch'
import { createCategoryTest } from '../../masters/models/testFactory/createCategory'
import { holdingIntervals } from './holdingIntervals'

const arrange = async () => {
    const branch = await createBranchTest()
    const category = await createCategoryTest()
    const employee = await createEmployeeTest({ branchId: branch.id })
    const asset = await createAsset({ assetTag: 'A1', branchId: branch.id, categoryId: category.id })
    return { asset, employee, at: { assetId: asset.id, branchId: branch.id, employeeId: employee.id } }
}

interface IssueRef {
    assetId: number
    branchId: number
    employeeId: number
}

const issuedOn = (at: IssueRef, txnAt: Date) =>
    createTxn({ ...at, txnType: 'ISSUE', fromStatus: 'IN_STOCK', toStatus: 'ISSUED', txnAt })

describe('holdingIntervals', () => {
    test('is empty for an asset nobody ever held', async () => {
        const { asset } = await arrange()

        expect(await holdingIntervals(asset.id)).toEqual([])
    })

    test('pairs each issue with the return that follows it', async () => {
        const { asset, employee, at } = await arrange()
        await issuedOn(at, new Date('2024-01-01T00:00:00Z'))
        await createTxn({
            ...at,
            txnType: 'RETURN',
            fromStatus: 'ISSUED',
            toStatus: 'IN_STOCK',
            returnReason: 'RESIGNATION',
            txnAt: new Date('2024-01-11T00:00:00Z')
        })

        const [interval] = await holdingIntervals(asset.id)

        expect(interval).toMatchObject({
            employeeName: 'Asha Menon',
            employeeCode: employee.employeeCode,
            returnReason: 'RESIGNATION',
            days: 10
        })
        expect(interval?.returnedAt).toEqual(new Date('2024-01-11T00:00:00Z'))
    })

    test('leaves an unreturned issue open and still counts its days', async () => {
        const { asset, at } = await arrange()
        await issuedOn(at, new Date('2024-01-01T00:00:00Z'))

        const [interval] = await holdingIntervals(asset.id)

        expect(interval).toMatchObject({ returnedAt: null, returnReason: null })
        expect(interval).toHaveProperty('days', expect.any(Number))
    })

    test('ignores the purchase event sitting before the first issue', async () => {
        const { asset, at } = await arrange()
        await createTxn({
            assetId: at.assetId,
            branchId: at.branchId,
            txnType: 'PURCHASE',
            toStatus: 'IN_STOCK',
            txnAt: new Date('2023-12-01T00:00:00Z')
        })
        await issuedOn(at, new Date('2024-01-01T00:00:00Z'))
        await createTxn({
            ...at,
            txnType: 'RETURN',
            fromStatus: 'ISSUED',
            toStatus: 'IN_REPAIR',
            returnReason: 'REPAIR',
            txnAt: new Date('2024-01-06T00:00:00Z')
        })

        const intervals = await holdingIntervals(asset.id)

        expect(intervals).toHaveLength(1)
        expect(intervals[0]).toMatchObject({ returnReason: 'REPAIR', days: 5 })
    })
})
