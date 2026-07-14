import request from 'supertest'
import { app } from '../../../app'

const mockFindBranchById = vi.fn()
const mockToggle = vi.fn()
const mockFindBranches = vi.fn()

vi.mock('../../models/branch/findBranchById', () => ({
    findBranchById: (id: unknown, tx: unknown) => mockFindBranchById(id, tx)
}))

vi.mock('../../models/branch/toggleBranchActive', () => ({
    toggleBranchActive: (branch: unknown, tx: unknown) => mockToggle(branch, tx)
}))

vi.mock('../../models/branch/findBranches', () => ({
    findBranches: (tx: unknown) => mockFindBranches(tx)
}))

const branch = { id: 1, code: 'BLR', name: 'Bangalore HQ', isActive: true }

describe('toggleBranch', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockFindBranchById.mockResolvedValue(branch)
        mockToggle.mockResolvedValue({ ...branch, isActive: false })
        mockFindBranches.mockResolvedValue([])
    })

    test('should toggle the branch and redirect to the list', async () => {
        const res = await request(app).post('/branches/1/toggle')
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/branches')
        expect(mockToggle).toHaveBeenCalledWith(branch, expect.anything())
    })

    test('should report the branch as deactivated when it has just been turned off', async () => {
        const agent = request.agent(app)
        await agent.post('/branches/1/toggle')
        const page = await agent.get('/branches')
        expect(page.text).toContain('Bangalore HQ deactivated.')
    })

    test('should report the branch as activated when it has just been turned on', async () => {
        mockToggle.mockResolvedValue({ ...branch, isActive: true })
        const agent = request.agent(app)
        await agent.post('/branches/1/toggle')
        const page = await agent.get('/branches')
        expect(page.text).toContain('Bangalore HQ activated.')
    })

    test('should not write anything when the branch does not exist', async () => {
        mockFindBranchById.mockResolvedValue(null)
        const res = await request(app).post('/branches/999/toggle')
        expect(res.status).toBe(302)
        expect(mockToggle).not.toHaveBeenCalled()
    })
})
