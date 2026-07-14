import request from 'supertest'
import { app } from '../../app'

const mockIntegrityDrift = vi.fn()

vi.mock('../models/integrityDrift', () => ({ integrityDrift: () => mockIntegrityDrift() }))

describe('GET /reports/integrity', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockIntegrityDrift.mockResolvedValue([])
    })

    test('says there is no drift when the ledger and the status column agree', async () => {
        const response = await request(app).get('/reports/integrity')

        expect(response.status).toBe(200)
        expect(mockIntegrityDrift).toHaveBeenCalledWith()
        expect(response.text).toContain('No drift')
    })

    test('lists any asset that has drifted from its ledger', async () => {
        mockIntegrityDrift.mockResolvedValue([
            { assetId: 7, assetTag: 'AST-0007', assetStatus: 'IN_STOCK', ledgerStatus: 'ISSUED' }
        ])

        const response = await request(app).get('/reports/integrity')

        expect(response.status).toBe(200)
        expect(response.text).toContain('1 asset(s) have drifted')
        expect(response.text).toContain('AST-0007')
    })
})
