import request from 'supertest'
import { app } from '../../app'

const mockDashboardStats = vi.fn()
const mockRecentActivity = vi.fn()

vi.mock('../models/dashboardStats', () => ({ dashboardStats: () => mockDashboardStats() }))
vi.mock('../models/recentActivity', () => ({ recentActivity: () => mockRecentActivity() }))

const stats = {
    totalAssets: 3,
    inStock: 1,
    issued: 1,
    inRepair: 1,
    scrapped: 1,
    totalValue: 87500.5,
    activeEmployees: 4
}

const txn = {
    assetId: 7,
    txnType: 'ISSUE',
    txnAt: new Date('2024-02-01T00:00:00Z'),
    returnReason: null,
    amount: null,
    asset: { assetTag: 'AST-0007' },
    employee: { firstName: 'Asha', lastName: 'Menon' }
}

describe('GET /', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockDashboardStats.mockResolvedValue(stats)
        mockRecentActivity.mockResolvedValue([txn])
    })

    test('renders the KPIs and the recent activity', async () => {
        const response = await request(app).get('/')

        expect(response.status).toBe(200)
        expect(mockDashboardStats).toHaveBeenCalledWith()
        expect(mockRecentActivity).toHaveBeenCalledWith()
        expect(response.text).toContain('₹87,501')
        expect(response.text).toContain('AST-0007')
        expect(response.text).toContain('Asha Menon')
    })

    test('renders the empty state when nothing has happened yet', async () => {
        mockRecentActivity.mockResolvedValue([])

        const response = await request(app).get('/')

        expect(response.status).toBe(200)
        expect(response.text).toContain('No activity yet.')
    })
})
