import request from 'supertest'
import { UniqueConstraintError } from 'sequelize'
import { app } from '../../../app'

const mockCreateBranch = vi.fn()
const mockFindBranches = vi.fn()

vi.mock('../../models/branch/createBranch', () => ({
    createBranch: (data: unknown, tx: unknown) => mockCreateBranch(data, tx)
}))

vi.mock('../../models/branch/findBranches', () => ({
    findBranches: (tx: unknown) => mockFindBranches(tx)
}))

const form = { code: 'blr', name: 'Bangalore HQ', city: 'Bengaluru', state: '' }

describe('createBranch', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockCreateBranch.mockResolvedValue({ id: 1, code: 'BLR', name: 'Bangalore HQ' })
        mockFindBranches.mockResolvedValue([])
    })

    test('should create the branch and redirect to the list', async () => {
        const res = await request(app).post('/branches').type('form').send(form)
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/branches')
    })

    test('should pass the form fields to the model, blanks as nulls', async () => {
        await request(app).post('/branches').type('form').send(form)
        expect(mockCreateBranch).toHaveBeenCalledWith(
            expect.objectContaining({ code: 'blr', name: 'Bangalore HQ', city: 'Bengaluru', state: null }),
            expect.anything()
        )
    })

    test('should confirm the creation', async () => {
        const agent = request.agent(app)
        await agent.post('/branches').type('form').send(form)
        const page = await agent.get('/branches')
        expect(page.text).toContain('Branch Bangalore HQ created.')
    })

    test('should redirect without a 500 when the code is already in use', async () => {
        mockCreateBranch.mockRejectedValue(new UniqueConstraintError({}))
        const res = await request(app).post('/branches').type('form').send(form)
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/branches')
    })

    test('should report the clashing code in its uppercased form', async () => {
        mockCreateBranch.mockRejectedValue(new UniqueConstraintError({}))
        const agent = request.agent(app)
        await agent.post('/branches').type('form').send(form)
        const page = await agent.get('/branches')
        expect(page.text).toContain('BLR')
        expect(page.text).toContain('is already in use.')
    })

    test('should reject a form with no code rather than writing it', async () => {
        const res = await request(app)
            .post('/branches')
            .type('form')
            .send({ ...form, code: '' })
        expect(res.status).toBe(400)
        expect(mockCreateBranch).not.toHaveBeenCalled()
    })
})
