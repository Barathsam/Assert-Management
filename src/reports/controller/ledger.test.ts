import request from 'supertest'
import { app } from '../../app'

const mockLedgerRows = vi.fn()

vi.mock('../models/ledgerRows', () => ({ ledgerRows: () => mockLedgerRows() }))

const txn = {
    id: 1,
    assetId: 7,
    txnType: 'ISSUE',
    txnAt: new Date('2024-02-01T00:00:00Z'),
    fromStatus: 'IN_STOCK',
    toStatus: 'ISSUED',
    returnReason: null,
    amount: null,
    vendor: null,
    remarks: null,
    asset: { assetTag: 'AST-0007' },
    employee: { id: 3, firstName: 'Asha', lastName: 'Menon' }
}

describe('GET /reports/ledger', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockLedgerRows.mockResolvedValue([txn])
    })

    test('renders every transaction with its asset and employee', async () => {
        const response = await request(app).get('/reports/ledger')

        expect(response.status).toBe(200)
        expect(mockLedgerRows).toHaveBeenCalledWith()
        expect(response.text).toContain('AST-0007')
        expect(response.text).toContain('Asha Menon')
        expect(response.text).toContain('Issued')
    })

    test('renders an empty ledger without failing', async () => {
        mockLedgerRows.mockResolvedValue([])

        const response = await request(app).get('/reports/ledger')

        expect(response.status).toBe(200)
        expect(response.text).toContain('Transaction Ledger')
    })
})
