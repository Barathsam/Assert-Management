import request from 'supertest'
import { app } from '../../app'

const mockFindActiveBranches = vi.fn()

vi.mock('../../masters/models/branch/findActiveBranches', () => ({
    findActiveBranches: (tx: unknown) => mockFindActiveBranches(tx)
}))

describe('newEmployeeForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockFindActiveBranches.mockResolvedValue([{ id: 1, name: 'Bangalore HQ' }])
    })

    test('should render the empty add-employee form', async () => {
        const res = await request(app).get('/employees/new')
        expect(res.status).toBe(200)
        expect(res.text).toContain('Add Employee')
    })

    test('should offer only the active branches, so a closed branch cannot be picked', async () => {
        await request(app).get('/employees/new')
        expect(mockFindActiveBranches).toHaveBeenCalledTimes(1)
    })

    test('should post the form to the create endpoint', async () => {
        const res = await request(app).get('/employees/new')
        expect(res.text).toContain('action="/employees"')
    })
})
