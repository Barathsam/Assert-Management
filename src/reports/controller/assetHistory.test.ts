import request from 'supertest'
import { app } from '../../app'

const mockAssetForHistory = vi.fn()
const mockAssetTotals = vi.fn()
const mockHistoryTimeline = vi.fn()
const mockHoldingIntervals = vi.fn()

vi.mock('../models/assetForHistory', () => ({ assetForHistory: (id: number) => mockAssetForHistory(id) }))
vi.mock('../models/assetTotals', () => ({ assetTotals: (id: number) => mockAssetTotals(id) }))
vi.mock('../models/historyTimeline', () => ({ historyTimeline: (id: number) => mockHistoryTimeline(id) }))
vi.mock('../models/holdingIntervals', () => ({ holdingIntervals: (id: number) => mockHoldingIntervals(id) }))

const scrappedAsset = {
    id: 7,
    assetTag: 'AST-0007',
    serialNumber: 'SN7',
    make: 'Dell',
    model: 'Latitude',
    status: 'SCRAPPED',
    purchaseDate: '2024-01-01',
    scrappedAt: new Date('2024-06-01T00:00:00Z'),
    scrapReason: 'End of life',
    category: { name: 'Laptop' },
    branch: { name: 'Chennai' }
}

const holding = {
    employeeId: 3,
    employeeName: 'Asha Menon',
    employeeCode: 'EMP0001',
    issuedAt: new Date('2024-02-01T00:00:00Z'),
    returnedAt: null,
    returnReason: null,
    days: 25
}

describe('GET /reports/history/:id', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockAssetForHistory.mockResolvedValue(scrappedAsset)
        mockAssetTotals.mockResolvedValue({
            purchaseCost: 82000,
            repairCost: 4500,
            scrapValue: 6000,
            repairCount: 1,
            daysOwned: 100
        })
        mockHistoryTimeline.mockResolvedValue([])
        mockHoldingIntervals.mockResolvedValue([holding])
    })

    test('renders the history of a scrapped asset and asks every model for that id', async () => {
        const response = await request(app).get('/reports/history/7')

        expect(response.status).toBe(200)
        expect(response.text).toContain('AST-0007')
        expect(mockAssetForHistory).toHaveBeenCalledWith(7)
        expect(mockAssetTotals).toHaveBeenCalledWith(7)
        expect(mockHistoryTimeline).toHaveBeenCalledWith(7)
        expect(mockHoldingIntervals).toHaveBeenCalledWith(7)
    })

    test('computes the net cost as purchase plus repairs minus scrap value', async () => {
        const response = await request(app).get('/reports/history/7')

        expect(response.text).toContain('₹80,500')
    })

    test('computes the utilisation from the holdings and the days owned', async () => {
        const response = await request(app).get('/reports/history/7')

        expect(response.text).toContain('25% of its life in use')
    })

    test('renders the timeline of every event', async () => {
        mockHistoryTimeline.mockResolvedValue([
            { txnType: 'PURCHASE', txnAt: new Date('2024-01-01T00:00:00Z'), amount: '82000.00', vendor: 'Redington' }
        ])

        const response = await request(app).get('/reports/history/7')

        expect(response.text).toContain('Purchased')
        expect(response.text).toContain('Redington')
    })

    test('redirects to the report index when the asset does not exist', async () => {
        mockAssetForHistory.mockResolvedValue(null)

        const response = await request(app).get('/reports/history/999')

        expect(response.status).toBe(302)
        expect(response.headers.location).toBe('/reports')
        expect(mockAssetTotals).not.toHaveBeenCalled()
    })
})
