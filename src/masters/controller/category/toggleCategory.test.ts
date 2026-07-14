import request from 'supertest'
import { app } from '../../../app'

const mockFindCategoryById = vi.fn()
const mockToggle = vi.fn()
const mockFindCategories = vi.fn()

vi.mock('../../models/category/findCategoryById', () => ({
    findCategoryById: (id: unknown, tx: unknown) => mockFindCategoryById(id, tx)
}))

vi.mock('../../models/category/toggleCategoryActive', () => ({
    toggleCategoryActive: (category: unknown, tx: unknown) => mockToggle(category, tx)
}))

vi.mock('../../models/category/findCategories', () => ({
    findCategories: (tx: unknown) => mockFindCategories(tx)
}))

const category = { id: 1, code: 'LAP', name: 'Laptop', isActive: true }

describe('toggleCategory', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockFindCategoryById.mockResolvedValue(category)
        mockToggle.mockResolvedValue({ ...category, isActive: false })
        mockFindCategories.mockResolvedValue([])
    })

    test('should toggle the category and redirect to the list', async () => {
        const res = await request(app).post('/categories/1/toggle')
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/categories')
        expect(mockToggle).toHaveBeenCalledWith(category, expect.anything())
    })

    test('should report the category as deactivated when it has just been turned off', async () => {
        const agent = request.agent(app)
        await agent.post('/categories/1/toggle')
        const page = await agent.get('/categories')
        expect(page.text).toContain('Laptop deactivated.')
    })

    test('should report the category as activated when it has just been turned on', async () => {
        mockToggle.mockResolvedValue({ ...category, isActive: true })
        const agent = request.agent(app)
        await agent.post('/categories/1/toggle')
        const page = await agent.get('/categories')
        expect(page.text).toContain('Laptop activated.')
    })

    test('should not write anything when the category does not exist', async () => {
        mockFindCategoryById.mockResolvedValue(null)
        const res = await request(app).post('/categories/999/toggle')
        expect(res.status).toBe(302)
        expect(mockToggle).not.toHaveBeenCalled()
    })
})
