import request from 'supertest'
import { app } from '../../app'

const mockStockRows = vi.fn()
const mockFindBranches = vi.fn()
const mockFindCategories = vi.fn()

vi.mock('../models/stockRows', () => ({ stockRows: (filters: unknown) => mockStockRows(filters) }))
vi.mock('../../masters/models/branch/findBranches', () => ({ findBranches: () => mockFindBranches() }))
vi.mock('../../masters/models/category/findCategories', () => ({ findCategories: () => mockFindCategories() }))

const row = (branchName: string, categoryName: string, qty: number, value: number) => ({
    branchId: 1,
    branchName,
    categoryId: 1,
    categoryName,
    qty,
    value
})

describe('GET /stock', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockStockRows.mockResolvedValue([row('Chennai', 'Laptop', 2, 100000)])
        mockFindBranches.mockResolvedValue([{ id: 1, name: 'Chennai' }])
        mockFindCategories.mockResolvedValue([{ id: 1, name: 'Laptop' }])
    })

    test('renders the stock table with the branch subtotals and the grand total', async () => {
        mockStockRows.mockResolvedValue([row('Chennai', 'Laptop', 2, 100000), row('Chennai', 'Monitor', 3, 30000)])

        const response = await request(app).get('/stock')

        expect(response.status).toBe(200)
        expect(response.text).toContain('Stock View')
        expect(response.text).toContain('₹1,30,000')
    })

    test('asks the model for no filters when the query is empty', async () => {
        const response = await request(app).get('/stock')

        expect(response.status).toBe(200)
        expect(mockStockRows).toHaveBeenCalledWith({ branchId: undefined, categoryId: undefined })
    })

    test('passes the branch and category filters through to the model', async () => {
        const response = await request(app).get('/stock?branchId=7&categoryId=3')

        expect(response.status).toBe(200)
        expect(mockStockRows).toHaveBeenCalledWith({ branchId: 7, categoryId: 3 })
    })

    test('ignores a non-numeric filter rather than passing NaN to SQL', async () => {
        await request(app).get('/stock?branchId=abc')

        expect(mockStockRows).toHaveBeenCalledWith({ branchId: undefined, categoryId: undefined })
    })

    test('renders the empty state when nothing is in stock', async () => {
        mockStockRows.mockResolvedValue([])

        const response = await request(app).get('/stock')

        expect(response.status).toBe(200)
        expect(response.text).toContain('Nothing in stock for this filter.')
    })
})
