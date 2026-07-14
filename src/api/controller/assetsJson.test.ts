import supertest from 'supertest'
import { app } from '../../app'

const mockFindActiveAssets = vi.fn()

vi.mock('../../assets/models/asset/findActiveAssets', () => ({
    findActiveAssets: (where: object) => mockFindActiveAssets(where)
}))

describe('GET /api/assets', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockFindActiveAssets.mockResolvedValue([])
    })

    test('should return the assets under a data key', async () => {
        mockFindActiveAssets.mockResolvedValue([{ id: 1, assetTag: 'LAP-BLR-000001' }])
        await supertest(app)
            .get('/api/assets')
            .expect(200)
            .expect({ data: [{ id: 1, assetTag: 'LAP-BLR-000001' }] })
    })

    test('should read through the active-asset view, so a scrapped asset can never reach the wire', async () => {
        await supertest(app).get('/api/assets').expect(200)
        expect(mockFindActiveAssets).toHaveBeenCalledTimes(1)
    })

    test('should pass the asset-type filter through to the query', async () => {
        await supertest(app).get('/api/assets?categoryId=3').expect(200)
        expect(mockFindActiveAssets).toHaveBeenCalledWith({ categoryId: 3 })
    })

    test('should pass the status filter through to the query', async () => {
        await supertest(app).get('/api/assets?status=IN_REPAIR').expect(200)
        expect(mockFindActiveAssets).toHaveBeenCalledWith({ status: 'IN_REPAIR' })
    })

    test('should ignore a status that is not a real asset status', async () => {
        await supertest(app).get('/api/assets?status=BANANA').expect(200)
        expect(mockFindActiveAssets).toHaveBeenCalledWith({})
    })
})
