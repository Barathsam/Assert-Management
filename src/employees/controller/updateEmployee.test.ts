import request from 'supertest'
import { UniqueConstraintError } from 'sequelize'
import { app } from '../../app'

const mockFindEmployeeById = vi.fn()
const mockUpdateEmployee = vi.fn()
const mockFindActiveBranches = vi.fn()

vi.mock('../models/employee/findEmployeeById', () => ({
    findEmployeeById: (id: unknown, tx: unknown) => mockFindEmployeeById(id, tx)
}))

vi.mock('../models/employee/updateEmployee', () => ({
    updateEmployee: (employee: unknown, data: unknown, tx: unknown) => mockUpdateEmployee(employee, data, tx)
}))

vi.mock('../../masters/models/branch/findActiveBranches', () => ({
    findActiveBranches: (tx: unknown) => mockFindActiveBranches(tx)
}))

const employee = { id: 7, employeeCode: 'EMP0001', firstName: 'Asha', lastName: 'Menon', branchId: 1 }

const form = { employeeCode: 'EMP0001', firstName: 'Asha', lastName: 'Menon', branchId: '2' }

describe('updateEmployee', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockFindEmployeeById.mockResolvedValue(employee)
        mockUpdateEmployee.mockResolvedValue(employee)
        mockFindActiveBranches.mockResolvedValue([])
    })

    test('should update the employee and redirect to their detail page', async () => {
        const res = await request(app).post('/employees/7').type('form').send(form)
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/employees/7')
    })

    test('should hand the loaded employee and the coerced fields to the model', async () => {
        await request(app).post('/employees/7').type('form').send(form)
        expect(mockUpdateEmployee).toHaveBeenCalledWith(
            employee,
            expect.objectContaining({ firstName: 'Asha', branchId: 2 }),
            expect.anything()
        )
    })

    test('should redirect to the list when the employee does not exist', async () => {
        mockFindEmployeeById.mockResolvedValue(null)
        const res = await request(app).post('/employees/999').type('form').send(form)
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/employees')
        expect(mockUpdateEmployee).not.toHaveBeenCalled()
    })

    test('should redirect back to the edit form without a 500 when the code is already in use', async () => {
        mockUpdateEmployee.mockRejectedValue(new UniqueConstraintError({}))
        const res = await request(app).post('/employees/7').type('form').send(form)
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/employees/7/edit')
    })

    test('should tell the user which detail clashed', async () => {
        mockUpdateEmployee.mockRejectedValue(new UniqueConstraintError({}))
        const agent = request.agent(app)
        await agent.post('/employees/7').type('form').send(form)
        const page = await agent.get('/employees/7/edit')
        expect(page.text).toContain('That employee code or email is already in use.')
    })

    test('should reject a form with no branch rather than writing it', async () => {
        const res = await request(app)
            .post('/employees/7')
            .type('form')
            .send({ ...form, branchId: '' })
        expect(res.status).toBe(400)
        expect(mockUpdateEmployee).not.toHaveBeenCalled()
    })
})
