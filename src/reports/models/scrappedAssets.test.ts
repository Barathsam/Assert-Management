import { createAsset } from '../../common/models/testFactory/createAsset'
import { createBranchTest } from '../../masters/models/testFactory/createBranch'
import { createCategoryTest } from '../../masters/models/testFactory/createCategory'
import { stockRows } from '../../stock/models/stockRows'
import { scrappedAssets } from './scrappedAssets'

const arrange = async () => {
    const branch = await createBranchTest({ code: 'MAA', name: 'Chennai' })
    const category = await createCategoryTest({ code: 'LAP', name: 'Laptop' })
    return { branchId: branch.id, categoryId: category.id }
}

const scrapped = (assetTag: string, at: Date) => ({
    assetTag,
    status: 'SCRAPPED' as const,
    scrappedAt: at,
    scrapValue: '6000.00',
    scrapReason: 'End of life'
})

describe('scrappedAssets', () => {
    test('is empty until something is scrapped', async () => {
        const at = await arrange()
        await createAsset({ assetTag: 'A1', ...at })

        expect(await scrappedAssets()).toEqual([])
    })

    test('requirement 7: a scrapped asset is absent from stock but present in the scrap register', async () => {
        const at = await arrange()
        await createAsset({ assetTag: 'LIVE', ...at })
        await createAsset({ ...at, ...scrapped('DEAD', new Date('2024-06-01T00:00:00Z')) })

        const stock = await stockRows({})
        const register = await scrappedAssets()

        expect(stock).toEqual([expect.objectContaining({ qty: 1 })])
        expect(register.map((asset) => asset.assetTag)).toEqual(['DEAD'])
    })

    test('newest scrap first, with its category and branch joined', async () => {
        const at = await arrange()
        await createAsset({ ...at, ...scrapped('OLD', new Date('2024-01-01T00:00:00Z')) })
        await createAsset({ ...at, ...scrapped('NEW', new Date('2024-06-01T00:00:00Z')) })

        const register = await scrappedAssets()

        expect(register.map((asset) => asset.assetTag)).toEqual(['NEW', 'OLD'])
        expect(register[0]).toMatchObject({ category: { name: 'Laptop' }, branch: { name: 'Chennai' } })
    })
})
