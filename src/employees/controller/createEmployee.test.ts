import request from 'supertest'
import { UniqueConstraintError } from 'sequelize'
import { app } from '../../app'

const mockCreateEmployee = vi.fn()
const mockFindActiveBranches = vi.fn()

vi.mock('../models/employee/createEmployee', () => ({
    createEmployee: (data: unknown, tx: unknown) => mockCreateEmployee(data, tx)
}))

vi.mock('../../masters/models/branch/findActiveBranches', () => ({
    findActiveBranches: (tx: unknown) => mockFindActiveBranches(tx)
}))

const form = { employeeCode: 'EMP0001', firstName: 'Asha', lastName: 'Menon', branchId: '1' }

describe('createEmployee', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockCreateEmployee.mockResolvedValue({ id: 7, firstName: 'Asha', lastName: 'Menon' })
        mockFindActiveBranches.mockResolvedValue([])
    })

    test('should create the employee and redirect to their detail page', async () => {
        const res = await request(app).post('/employees').type('form').send(form)
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/employees/7')
    })

    test('should pass the coerced form fields to the model', async () => {
        await request(app).post('/employees').type('form').send(form)
        expect(mockCreateEmployee).toHaveBeenCalledWith(
            expect.objectContaining({ employeeCode: 'EMP0001', firstName: 'Asha', branchId: 1 }),
            expect.anything()
        )
    })

    test('should turn the blank optional fields into nulls', async () => {
        await request(app)
            .post('/employees')
            .type('form')
            .send({ ...form, email: '', phone: '', designation: '', department: '', dateOfJoining: '' })
        expect(mockCreateEmployee).toHaveBeenCalledWith(
            expect.objectContaining({ email: null, phone: null, dateOfJoining: null }),
            expect.anything()
        )
    })

    test('should redirect back to the form without a 500 when the code is already in use', async () => {
        mockCreateEmployee.mockRejectedValue(new UniqueConstraintError({}))
        const res = await request(app).post('/employees').type('form').send(form)
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/employees/new')
    })

    test('should tell the user which detail clashed', async () => {
        mockCreateEmployee.mockRejectedValue(new UniqueConstraintError({}))
        const agent = request.agent(app)
        await agent.post('/employees').type('form').send(form)
        const page = await agent.get('/employees/new')
        expect(page.text).toContain('That employee code or email is already in use.')
    })

    test('should reject a form with no employee code rather than writing it', async () => {
        const res = await request(app)
            .post('/employees')
            .type('form')
            .send({ ...form, employeeCode: '' })
        expect(res.status).toBe(400)
        expect(mockCreateEmployee).not.toHaveBeenCalled()
    })
})
