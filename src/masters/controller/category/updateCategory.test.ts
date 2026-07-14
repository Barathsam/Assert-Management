import request from 'supertest'
import { UniqueConstraintError } from 'sequelize'
import { app } from '../../../app'

const mockFindCategoryById = vi.fn()
const mockUpdateCategory = vi.fn()
const mockFindCategories = vi.fn()

vi.mock('../../models/category/findCategoryById', () => ({
    findCategoryById: (id: unknown, tx: unknown) => mockFindCategoryById(id, tx)
}))

vi.mock('../../models/category/updateCategory', () => ({
    updateCategory: (category: unknown, data: unknown, tx: unknown) => mockUpdateCategory(category, data, tx)
}))

vi.mock('../../models/category/findCategories', () => ({
    findCategories: (tx: unknown) => mockFindCategories(tx)
}))

const category = { id: 1, code: 'LAP', name: 'Laptop' }

const form = { code: 'LAP', name: 'Notebook', description: '' }

describe('updateCategory', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockFindCategoryById.mockResolvedValue(category)
        mockUpdateCategory.mockResolvedValue({ ...category, name: 'Notebook' })
        mockFindCategories.mockResolvedValue([])
    })

    test('should update the category and redirect to the list', async () => {
        const res = await request(app).post('/categories/1').type('form').send(form)
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/categories')
    })

    test('should hand the loaded category and the form fields to the model', async () => {
        await request(app).post('/categories/1').type('form').send(form)
        expect(mockUpdateCategory).toHaveBeenCalledWith(
            category,
            expect.objectContaining({ code: 'LAP', name: 'Notebook', description: null }),
            expect.anything()
        )
    })

    test('should confirm the update using the saved name', async () => {
        const agent = request.agent(app)
        await agent.post('/categories/1').type('form').send(form)
        const page = await agent.get('/categories')
        expect(page.text).toContain('Category Notebook updated.')
    })

    test('should not write anything when the category does not exist', async () => {
        mockFindCategoryById.mockResolvedValue(null)
        const res = await request(app).post('/categories/999').type('form').send(form)
        expect(res.status).toBe(302)
        expect(mockUpdateCategory).not.toHaveBeenCalled()
    })

    test('should redirect without a 500 when the code or name is already in use', async () => {
        mockUpdateCategory.mockRejectedValue(new UniqueConstraintError({}))
        const res = await request(app).post('/categories/1').type('form').send(form)
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/categories')
    })
})
