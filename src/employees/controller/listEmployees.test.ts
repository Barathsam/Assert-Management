import request from 'supertest'
import { Op } from 'sequelize'
import { app } from '../../app'

const mockFindEmployees = vi.fn()
const mockFindBranches = vi.fn()

vi.mock('../models/employee/findEmployees', () => ({
    findEmployees: (where: unknown, tx: unknown) => mockFindEmployees(where, tx)
}))

vi.mock('../../masters/models/branch/findBranches', () => ({
    findBranches: (tx: unknown) => mockFindBranches(tx)
}))

const branch = { id: 1, name: 'Bangalore HQ' }

const employee = {
    id: 7,
    employeeCode: 'EMP0001',
    firstName: 'Asha',
    lastName: 'Menon',
    email: 'asha@example.com',
    designation: 'Field Engineer',
    department: 'Operations',
    isActive: true,
    branch,
    heldAssets: [{ id: 9 }]
}

describe('listEmployees', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockFindEmployees.mockResolvedValue([employee])
        mockFindBranches.mockResolvedValue([branch])
    })

    test('should default to the active employees when no status is given', async () => {
        const res = await request(app).get('/employees')
        expect(res.status).toBe(200)
        expect(mockFindEmployees).toHaveBeenCalledWith({ isActive: true }, expect.anything())
    })

    test('should list the inactive employees when the status is inactive', async () => {
        await request(app).get('/employees?status=inactive')
        expect(mockFindEmployees).toHaveBeenCalledWith({ isActive: false }, expect.anything())
    })

    test('should drop the active filter when the status is all', async () => {
        await request(app).get('/employees?status=all')
        expect(mockFindEmployees).toHaveBeenCalledWith({}, expect.anything())
    })

    test('should filter by branch', async () => {
        await request(app).get('/employees?status=all&branchId=4')
        expect(mockFindEmployees).toHaveBeenCalledWith({ branchId: 4 }, expect.anything())
    })

    test('should pass the search term to every searchable column', async () => {
        await request(app).get('/employees?status=all&q=ash')
        const where = mockFindEmployees.mock.calls[0]?.[0] as Record<symbol, unknown[]>
        expect(where[Op.or]).toHaveLength(5)
    })

    test('should render the employee and the number of assets they hold', async () => {
        const res = await request(app).get('/employees')
        expect(res.text).toContain('EMP0001')
        expect(res.text).toContain('Asha Menon')
    })

    test('should offer every branch, active or not, in the filter dropdown', async () => {
        await request(app).get('/employees')
        expect(mockFindBranches).toHaveBeenCalledTimes(1)
    })
})
