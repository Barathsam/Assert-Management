import { applyTransition } from './applyTransition'

const mockLockAssetById = vi.fn()
const mockCreateTransaction = vi.fn()
const mockFindLatestTransaction = vi.fn()

vi.mock('../models/asset/lockAssetById', () => ({
    lockAssetById: (id: number, tx: object) => mockLockAssetById(id, tx)
}))
vi.mock('../models/assetTransaction/createTransaction', () => ({
    createTransaction: (row: object, tx: object) => mockCreateTransaction(row, tx)
}))
vi.mock('../models/assetTransaction/findLatestTransaction', () => ({
    findLatestTransaction: (id: number, tx: object) => mockFindLatestTransaction(id, tx)
}))

const tx = {} as never
const txnAt = new Date('2026-03-01T00:00:00Z')

const fakeAsset = (status: string) => ({
    id: 7,
    assetTag: 'LAP-BLR-000007',
    branchId: 2,
    status,
    save: vi.fn().mockResolvedValue(undefined)
})

const issueInput = (mutate = vi.fn()) => ({
    assetId: 7,
    action: 'ISSUE' as const,
    toStatus: 'ISSUED' as const,
    ledger: { txnType: 'ISSUE' as const, txnAt, employeeId: 42 },
    mutate
})

describe('applyTransition', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockFindLatestTransaction.mockResolvedValue(null)
    })

    test('should take a row lock on the asset before deciding anything', async () => {
        mockLockAssetById.mockResolvedValue(fakeAsset('IN_STOCK'))
        await applyTransition(issueInput(), tx)
        expect(mockLockAssetById).toHaveBeenCalledWith(7, tx)
    })

    test('should write the new status and append the ledger row', async () => {
        const asset = fakeAsset('IN_STOCK')
        mockLockAssetById.mockResolvedValue(asset)
        await applyTransition(issueInput(), tx)
        expect(asset.status).toBe('ISSUED')
        expect(asset.save).toHaveBeenCalledWith({ transaction: tx })
        expect(mockCreateTransaction).toHaveBeenCalledWith(
            expect.objectContaining({
                assetId: 7,
                branchId: 2,
                txnType: 'ISSUE',
                fromStatus: 'IN_STOCK',
                toStatus: 'ISSUED',
                employeeId: 42
            }),
            tx
        )
    })

    test('should apply the caller mutation before saving', async () => {
        const mutate = vi.fn()
        mockLockAssetById.mockResolvedValue(fakeAsset('IN_STOCK'))
        await applyTransition(issueInput(mutate), tx)
        expect(mutate).toHaveBeenCalled()
    })

    test('should reject the transition when the status read under the lock is illegal', async () => {
        mockLockAssetById.mockResolvedValue(fakeAsset('ISSUED'))
        await expect(applyTransition(issueInput(), tx)).rejects.toThrowError(
            'Cannot issue LAP-BLR-000007: it is currently Issued.'
        )
        expect(mockCreateTransaction).not.toHaveBeenCalled()
    })

    test('should refuse any transition on a scrapped asset', async () => {
        mockLockAssetById.mockResolvedValue(fakeAsset('SCRAPPED'))
        await expect(applyTransition(issueInput(), tx)).rejects.toThrowError(/Scrapping is final/)
    })

    test('should refuse an event dated before the last one on the ledger', async () => {
        mockLockAssetById.mockResolvedValue(fakeAsset('IN_STOCK'))
        mockFindLatestTransaction.mockResolvedValue({ txnAt: new Date('2026-06-01T00:00:00Z') })
        await expect(applyTransition(issueInput(), tx)).rejects.toThrowError(/cannot be earlier/)
        expect(mockCreateTransaction).not.toHaveBeenCalled()
    })

    test('should fail when the asset does not exist', async () => {
        mockLockAssetById.mockResolvedValue(null)
        await expect(applyTransition(issueInput(), tx)).rejects.toThrowError('Asset not found.')
    })
})
