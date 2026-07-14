import request from 'supertest'
import { app } from '../../../app'

const mockFindBranches = vi.fn()

vi.mock('../../models/branch/findBranches', () => ({
    findBranches: (tx: unknown) => mockFindBranches(tx)
}))

const branch = { id: 1, code: 'BLR', name: 'Bangalore HQ', city: 'Bengaluru', state: 'Karnataka', isActive: true }

describe('listBranches', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockFindBranches.mockResolvedValue([
            branch,
            { ...branch, id: 2, code: 'MAA', name: 'Chennai', isActive: false }
        ])
    })

    test('should render every branch, active and inactive', async () => {
        const res = await request(app).get('/branches')
        expect(res.status).toBe(200)
        expect(res.text).toContain('Bangalore HQ')
        expect(res.text).toContain('Chennai')
    })

    test('should offer to deactivate an active branch and activate an inactive one', async () => {
        const res = await request(app).get('/branches')
        expect(res.text).toContain('Deactivate')
        expect(res.text).toContain('Activate')
    })

    test('should load the branches through the model', async () => {
        await request(app).get('/branches')
        expect(mockFindBranches).toHaveBeenCalledTimes(1)
    })
})
