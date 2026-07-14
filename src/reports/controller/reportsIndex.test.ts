import request from 'supertest'
import { app } from '../../app'

describe('GET /reports', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('renders the report index and links to every report', async () => {
        const response = await request(app).get('/reports')

        expect(response.status).toBe(200)
        expect(response.text).toContain('/reports/scrapped')
        expect(response.text).toContain('/reports/ledger')
        expect(response.text).toContain('/reports/integrity')
    })
})
