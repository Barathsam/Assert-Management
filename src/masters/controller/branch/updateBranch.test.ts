import request from 'supertest'
import { UniqueConstraintError } from 'sequelize'
import { app } from '../../../app'

const mockFindBranchById = vi.fn()
const mockUpdateBranch = vi.fn()
const mockFindBranches = vi.fn()

vi.mock('../../models/branch/findBranchById', () => ({
    findBranchById: (id: unknown, tx: unknown) => mockFindBranchById(id, tx)
}))

vi.mock('../../models/branch/updateBranch', () => ({
    updateBranch: (branch: unknown, data: unknown, tx: unknown) => mockUpdateBranch(branch, data, tx)
}))

vi.mock('../../models/branch/findBranches', () => ({
    findBranches: (tx: unknown) => mockFindBranches(tx)
}))

const branch = { id: 1, code: 'BLR', name: 'Bangalore HQ' }

const form = { code: 'BLR', name: 'Bangalore North', city: '', state: '' }

describe('updateBranch', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockFindBranchById.mockResolvedValue(branch)
        mockUpdateBranch.mockResolvedValue({ ...branch, name: 'Bangalore North' })
        mockFindBranches.mockResolvedValue([])
    })

    test('should update the branch and redirect to the list', async () => {
        const res = await request(app).post('/branches/1').type('form').send(form)
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/branches')
    })

    test('should hand the loaded branch and the form fields to the model', async () => {
        await request(app).post('/branches/1').type('form').send(form)
        expect(mockUpdateBranch).toHaveBeenCalledWith(
            branch,
            expect.objectContaining({ code: 'BLR', name: 'Bangalore North', city: null }),
            expect.anything()
        )
    })

    test('should confirm the update using the saved name', async () => {
        const agent = request.agent(app)
        await agent.post('/branches/1').type('form').send(form)
        const page = await agent.get('/branches')
        expect(page.text).toContain('Branch Bangalore North updated.')
    })

    test('should not write anything when the branch does not exist', async () => {
        mockFindBranchById.mockResolvedValue(null)
        const res = await request(app).post('/branches/999').type('form').send(form)
        expect(res.status).toBe(302)
        expect(mockUpdateBranch).not.toHaveBeenCalled()
    })

    test('should redirect without a 500 when the code is already in use', async () => {
        mockUpdateBranch.mockRejectedValue(new UniqueConstraintError({}))
        const res = await request(app).post('/branches/1').type('form').send(form)
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/branches')
    })
})
