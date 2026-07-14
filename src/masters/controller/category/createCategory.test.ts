import request from 'supertest'
import { UniqueConstraintError } from 'sequelize'
import { app } from '../../../app'

const mockCreateCategory = vi.fn()
const mockFindCategories = vi.fn()

vi.mock('../../models/category/createCategory', () => ({
    createCategory: (data: unknown, tx: unknown) => mockCreateCategory(data, tx)
}))

vi.mock('../../models/category/findCategories', () => ({
    findCategories: (tx: unknown) => mockFindCategories(tx)
}))

const form = { code: 'lap', name: 'Laptop', description: '' }

describe('createCategory', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockCreateCategory.mockResolvedValue({ id: 1, code: 'LAP', name: 'Laptop' })
        mockFindCategories.mockResolvedValue([])
    })

    test('should create the category and redirect to the list', async () => {
        const res = await request(app).post('/categories').type('form').send(form)
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/categories')
    })

    test('should pass the form fields to the model, a blank description as null', async () => {
        await request(app).post('/categories').type('form').send(form)
        expect(mockCreateCategory).toHaveBeenCalledWith(
            expect.objectContaining({ code: 'lap', name: 'Laptop', description: null }),
            expect.anything()
        )
    })

    test('should confirm the creation', async () => {
        const agent = request.agent(app)
        await agent.post('/categories').type('form').send(form)
        const page = await agent.get('/categories')
        expect(page.text).toContain('Category Laptop created.')
    })

    test('should redirect without a 500 when the code or name is already in use', async () => {
        mockCreateCategory.mockRejectedValue(new UniqueConstraintError({}))
        const res = await request(app).post('/categories').type('form').send(form)
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/categories')
    })

    test('should explain that the code or name already exists', async () => {
        mockCreateCategory.mockRejectedValue(new UniqueConstraintError({}))
        const agent = request.agent(app)
        await agent.post('/categories').type('form').send(form)
        const page = await agent.get('/categories')
        expect(page.text).toContain('A category with that code or name already exists.')
    })

    test('should reject a form with no name rather than writing it', async () => {
        const res = await request(app)
            .post('/categories')
            .type('form')
            .send({ ...form, name: '' })
        expect(res.status).toBe(400)
        expect(mockCreateCategory).not.toHaveBeenCalled()
    })
})
