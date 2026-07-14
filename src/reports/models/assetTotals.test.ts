import { createAsset } from '../../common/models/testFactory/createAsset'
import { createTxn } from '../../common/models/testFactory/createTxn'
import { createBranchTest } from '../../masters/models/testFactory/createBranch'
import { createCategoryTest } from '../../masters/models/testFactory/createCategory'
import { assetTotals } from './assetTotals'

const refs = async () => {
    const branch = await createBranchTest()
    const category = await createCategoryTest()
    return { branchId: branch.id, categoryId: category.id }
}

const arrangeScrappedAsset = async () => {
    const { branchId, categoryId } = await refs()
    const asset = await createAsset({
        assetTag: 'A1',
        branchId,
        categoryId,
        purchaseDate: '2024-01-01',
        status: 'SCRAPPED',
        scrappedAt: new Date('2024-03-01T00:00:00Z')
    })
    const at = { assetId: asset.id, branchId }
    const repair = { txnType: 'REPAIR_COMPLETE', fromStatus: 'IN_REPAIR', toStatus: 'IN_STOCK' } as const
    await createTxn({ ...at, txnType: 'PURCHASE', toStatus: 'IN_STOCK', amount: '82000.00' })
    await createTxn({ ...at, ...repair, amount: '4500.00' })
    await createTxn({ ...at, ...repair, amount: '1500.50' })
    await createTxn({ ...at, txnType: 'SCRAP', fromStatus: 'IN_STOCK', toStatus: 'SCRAPPED', amount: '6000.00' })
    return asset
}

describe('assetTotals', () => {
    test('sums purchase, repair and scrap amounts in SQL and counts the repairs', async () => {
        const asset = await arrangeScrappedAsset()

        expect(await assetTotals(asset.id)).toEqual({
            purchaseCost: 82000,
            repairCost: 6000.5,
            scrapValue: 6000,
            repairCount: 2,
            daysOwned: 60
        })
    })

    test('is all zeroes for an asset that does not exist', async () => {
        expect(await assetTotals(9999)).toEqual({
            purchaseCost: 0,
            repairCost: 0,
            scrapValue: 0,
            repairCount: 0,
            daysOwned: 0
        })
    })

    test('counts days owned up to today while the asset is still alive', async () => {
        const { branchId, categoryId } = await refs()
        const asset = await createAsset({ assetTag: 'A2', branchId, categoryId, purchaseDate: '2024-01-01' })

        expect((await assetTotals(asset.id)).daysOwned).toBeGreaterThan(60)
    })
})
