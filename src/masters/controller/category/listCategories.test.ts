import request from 'supertest'
import { app } from '../../../app'

const mockFindCategories = vi.fn()

vi.mock('../../models/category/findCategories', () => ({
    findCategories: (tx: unknown) => mockFindCategories(tx)
}))

const category = { id: 1, code: 'LAP', name: 'Laptop', description: 'Portable computers', isActive: true }

describe('listCategories', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockFindCategories.mockResolvedValue([
            category,
            { ...category, id: 2, code: 'DRL', name: 'Drill Machine', isActive: false }
        ])
    })

    test('should render every category, active and inactive', async () => {
        const res = await request(app).get('/categories')
        expect(res.status).toBe(200)
        expect(res.text).toContain('Laptop')
        expect(res.text).toContain('Drill Machine')
    })

    test('should offer to deactivate an active category and activate an inactive one', async () => {
        const res = await request(app).get('/categories')
        expect(res.text).toContain('Deactivate')
        expect(res.text).toContain('Activate')
    })

    test('should load the categories through the model', async () => {
        await request(app).get('/categories')
        expect(mockFindCategories).toHaveBeenCalledTimes(1)
    })
})
