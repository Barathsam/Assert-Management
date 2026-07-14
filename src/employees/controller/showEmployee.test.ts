import request from 'supertest'
import { app } from '../../app'

const mockFind = vi.fn()

vi.mock('../models/employee/findEmployeeWithHeldAssets', () => ({
    findEmployeeWithHeldAssets: (id: unknown, tx: unknown) => mockFind(id, tx)
}))

const asset = {
    id: 9,
    assetTag: 'LAP-BLR-000001',
    serialNumber: 'SN1',
    make: 'Dell',
    model: 'Latitude',
    category: { name: 'Laptop' }
}

const employee = {
    id: 7,
    employeeCode: 'EMP0001',
    firstName: 'Asha',
    lastName: 'Menon',
    isActive: true,
    dateOfJoining: '2024-01-15',
    branch: { name: 'Bangalore HQ' },
    heldAssets: [asset]
}

describe('showEmployee', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockFind.mockResolvedValue(employee)
    })

    test('should render the employee detail page', async () => {
        const res = await request(app).get('/employees/7')
        expect(res.status).toBe(200)
        expect(res.text).toContain('Asha Menon')
    })

    test('should look the employee up by their numeric id', async () => {
        await request(app).get('/employees/7')
        expect(mockFind).toHaveBeenCalledWith(7, expect.anything())
    })

    test('should list the assets the employee currently holds', async () => {
        const res = await request(app).get('/employees/7')
        expect(res.text).toContain('LAP-BLR-000001')
        expect(res.text).toContain('Laptop')
    })

    test('should warn that held assets block deactivation', async () => {
        const res = await request(app).get('/employees/7')
        expect(res.text).toContain('cannot be deactivated until these assets are returned')
    })

    test('should redirect to the list when the employee does not exist', async () => {
        mockFind.mockResolvedValue(null)
        const res = await request(app).get('/employees/999')
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/employees')
    })
})
