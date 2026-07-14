import request from 'supertest'
import { app } from '../../app'

const mockScrappedAssets = vi.fn()

vi.mock('../models/scrappedAssets', () => ({ scrappedAssets: () => mockScrappedAssets() }))

const asset = {
    id: 7,
    assetTag: 'AST-0007',
    serialNumber: 'SN7',
    make: 'Dell',
    model: 'Latitude',
    purchaseCost: '82000.00',
    scrapValue: '6000.00',
    scrapReason: 'End of life',
    scrappedAt: new Date('2024-06-01T00:00:00Z'),
    category: { name: 'Laptop' },
    branch: { name: 'Chennai' }
}

describe('GET /reports/scrapped', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockScrappedAssets.mockResolvedValue([asset])
    })

    test('renders every scrapped asset with its net loss', async () => {
        const response = await request(app).get('/reports/scrapped')

        expect(response.status).toBe(200)
        expect(mockScrappedAssets).toHaveBeenCalledWith()
        expect(response.text).toContain('AST-0007')
        expect(response.text).toContain('₹76,000')
    })

    test('renders the empty state when nothing has been scrapped', async () => {
        mockScrappedAssets.mockResolvedValue([])

        const response = await request(app).get('/reports/scrapped')

        expect(response.status).toBe(200)
        expect(response.text).toContain('Nothing has been scrapped yet.')
    })
})
