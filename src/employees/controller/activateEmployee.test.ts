import request from 'supertest'
import { app } from '../../app'

const mockFindEmployeeById = vi.fn()
const mockSetActive = vi.fn()

vi.mock('../models/employee/findEmployeeById', () => ({
    findEmployeeById: (id: unknown, tx: unknown) => mockFindEmployeeById(id, tx)
}))

vi.mock('../models/employee/setActive', () => ({
    setActive: (employee: unknown, isActive: unknown, dateOfExit: unknown, tx: unknown) =>
        mockSetActive(employee, isActive, dateOfExit, tx)
}))

const employee = { id: 7, firstName: 'Asha', lastName: 'Menon', isActive: false }

describe('activateEmployee', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockFindEmployeeById.mockResolvedValue(employee)
        mockSetActive.mockResolvedValue({ ...employee, isActive: true })
    })

    test('should reactivate the employee and clear their exit date', async () => {
        const res = await request(app).post('/employees/7/activate')
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/employees/7')
        expect(mockSetActive).toHaveBeenCalledWith(employee, true, null, expect.anything())
    })

    test('should not write anything when the employee does not exist', async () => {
        mockFindEmployeeById.mockResolvedValue(null)
        const res = await request(app).post('/employees/999/activate')
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/employees/999')
        expect(mockSetActive).not.toHaveBeenCalled()
    })
})
