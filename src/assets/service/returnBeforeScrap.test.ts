import { returnBeforeScrap } from './returnBeforeScrap'

const mockReturnAsset = vi.fn()

vi.mock('./returnAsset', () => ({
    returnAsset: (id: number, input: object, tx: object) => mockReturnAsset(id, input, tx)
}))

const tx = {} as never
const txnAt = new Date('2026-05-01T00:00:00Z')
const input = { txnAt, scrapValue: 0, reason: 'Beyond economic repair' }

describe('returnBeforeScrap', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockReturnAsset.mockResolvedValue(undefined)
    })

    test('should return the asset from its holder, recording why it came back', async () => {
        await returnBeforeScrap(7, { ...input, returnReason: 'RESIGNATION' }, tx)
        expect(mockReturnAsset).toHaveBeenCalledWith(
            7,
            { reason: 'RESIGNATION', txnAt, remarks: 'Returned for scrapping' },
            tx
        )
    })

    test('should refuse without a return reason, so we never lose who held it last', async () => {
        await expect(returnBeforeScrap(7, input, tx)).rejects.toThrowError(/still issued/)
        expect(mockReturnAsset).not.toHaveBeenCalled()
    })
})
