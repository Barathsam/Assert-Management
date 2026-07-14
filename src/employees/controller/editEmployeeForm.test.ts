import request from 'supertest'
import { app } from '../../app'

const mockFindEmployeeById = vi.fn()
const mockFindActiveBranches = vi.fn()

vi.mock('../models/employee/findEmployeeById', () => ({
    findEmployeeById: (id: unknown, tx: unknown) => mockFindEmployeeById(id, tx)
}))

vi.mock('../../masters/models/branch/findActiveBranches', () => ({
    findActiveBranches: (tx: unknown) => mockFindActiveBranches(tx)
}))

const employee = { id: 7, employeeCode: 'EMP0001', firstName: 'Asha', lastName: 'Menon', branchId: 1 }

describe('editEmployeeForm', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockFindEmployeeById.mockResolvedValue(employee)
        mockFindActiveBranches.mockResolvedValue([{ id: 1, name: 'Bangalore HQ' }])
    })

    test('should render the form pre-filled with the employee', async () => {
        const res = await request(app).get('/employees/7/edit')
        expect(res.status).toBe(200)
        expect(res.text).toContain('Edit Asha Menon')
        expect(res.text).toContain('EMP0001')
    })

    test('should post the form back to the update endpoint', async () => {
        const res = await request(app).get('/employees/7/edit')
        expect(res.text).toContain('action="/employees/7"')
    })

    test('should offer only the active branches', async () => {
        await request(app).get('/employees/7/edit')
        expect(mockFindActiveBranches).toHaveBeenCalledTimes(1)
    })

    test('should redirect to the list when the employee does not exist', async () => {
        mockFindEmployeeById.mockResolvedValue(null)
        const res = await request(app).get('/employees/999/edit')
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/employees')
    })
})
