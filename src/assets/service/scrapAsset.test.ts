import { scrapAsset } from './scrapAsset'

const mockFindAssetById = vi.fn()
const mockApplyTransition = vi.fn()
const mockReturnBeforeScrap = vi.fn()

vi.mock('../models/asset/findAssetById', () => ({
    findAssetById: (id: number, tx: object) => mockFindAssetById(id, tx)
}))
vi.mock('./applyTransition', () => ({
    applyTransition: (input: object, tx: object) => mockApplyTransition(input, tx)
}))
vi.mock('./returnBeforeScrap', () => ({
    returnBeforeScrap: (id: number, input: object, tx: object) => mockReturnBeforeScrap(id, input, tx)
}))

const tx = {} as never
const txnAt = new Date('2026-05-01T00:00:00Z')
const input = { txnAt, scrapValue: 3000, reason: 'Beyond economic repair' }

describe('scrapAsset', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockApplyTransition.mockResolvedValue({ id: 7, assetTag: 'LAP-BLR-000007' })
        mockReturnBeforeScrap.mockResolvedValue(undefined)
    })

    test('should scrap an in-stock asset without returning it from anyone first', async () => {
        mockFindAssetById.mockResolvedValue({ status: 'IN_STOCK' })
        await scrapAsset(7, input, tx)
        expect(mockReturnBeforeScrap).not.toHaveBeenCalled()
        expect(mockApplyTransition).toHaveBeenCalledTimes(1)
    })

    test('should scrap an in-repair asset without returning it from anyone first', async () => {
        mockFindAssetById.mockResolvedValue({ status: 'IN_REPAIR' })
        await scrapAsset(7, input, tx)
        expect(mockReturnBeforeScrap).not.toHaveBeenCalled()
    })

    test('should stamp the scrap date, value and reason onto the asset', async () => {
        mockFindAssetById.mockResolvedValue({ status: 'IN_STOCK' })
        await scrapAsset(7, input, tx)
        const call = mockApplyTransition.mock.calls[0]?.[0] as { mutate: (a: object) => void }
        const asset: Record<string, unknown> = {}
        call.mutate(asset)
        expect(asset).toEqual({ scrappedAt: txnAt, scrapValue: '3000', scrapReason: 'Beyond economic repair' })
    })

    test('should return an issued asset from its holder before writing it off', async () => {
        mockFindAssetById.mockResolvedValue({ status: 'ISSUED' })
        const withReason = { ...input, returnReason: 'RESIGNATION' as const }
        await scrapAsset(7, withReason, tx)
        expect(mockReturnBeforeScrap).toHaveBeenCalledWith(7, withReason, tx)
        expect(mockApplyTransition).toHaveBeenCalledTimes(1)
    })

    test('should fail when the asset does not exist', async () => {
        mockFindAssetById.mockResolvedValue(null)
        await expect(scrapAsset(7, input, tx)).rejects.toThrowError('Asset not found.')
    })
})
