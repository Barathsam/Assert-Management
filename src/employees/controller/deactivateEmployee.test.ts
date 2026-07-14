import request from 'supertest'
import { app } from '../../app'
import { today } from '../../common/format/parseFormDate'

const mockFind = vi.fn()
const mockSetActive = vi.fn()

vi.mock('../models/employee/findEmployeeWithHeldAssets', () => ({
    findEmployeeWithHeldAssets: (id: unknown, tx: unknown) => mockFind(id, tx)
}))

vi.mock('../models/employee/setActive', () => ({
    setActive: (employee: unknown, isActive: unknown, dateOfExit: unknown, tx: unknown) =>
        mockSetActive(employee, isActive, dateOfExit, tx)
}))

const asset = { id: 9, assetTag: 'LAP-BLR-000001', serialNumber: 'SN1', make: 'Dell', model: 'Latitude' }

const employee = (heldAssets: unknown[]) => ({
    id: 7,
    employeeCode: 'EMP0001',
    firstName: 'Asha',
    lastName: 'Menon',
    isActive: true,
    heldAssets
})

describe('deactivateEmployee', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockSetActive.mockResolvedValue(employee([]))
    })

    test('should deactivate an employee who holds nothing and stamp their exit date', async () => {
        mockFind.mockResolvedValue(employee([]))
        const res = await request(app).post('/employees/7/deactivate')
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/employees/7')
        expect(mockSetActive).toHaveBeenCalledWith(
            expect.objectContaining({ id: 7 }),
            false,
            today(),
            expect.anything()
        )
    })

    test('should refuse to deactivate an employee who still holds an asset', async () => {
        mockFind.mockResolvedValue(employee([asset]))
        const res = await request(app).post('/employees/7/deactivate')
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/employees/7')
        expect(mockSetActive).not.toHaveBeenCalled()
    })

    test('should name the employee and count the assets they must return', async () => {
        mockFind.mockResolvedValue(employee([asset, { ...asset, id: 10 }]))
        const agent = request.agent(app)
        await agent.post('/employees/7/deactivate')
        const page = await agent.get('/employees/7')
        expect(page.text).toContain('Asha Menon still holds 2 asset(s). Return them before deactivating.')
    })

    test('should confirm the deactivation when the employee holds nothing', async () => {
        mockFind.mockResolvedValue(employee([]))
        const agent = request.agent(app)
        await agent.post('/employees/7/deactivate')
        const page = await agent.get('/employees/7')
        expect(page.text).toContain('Asha Menon deactivated.')
    })

    test('should redirect to the list when the employee does not exist', async () => {
        mockFind.mockResolvedValue(null)
        const res = await request(app).post('/employees/999/deactivate')
        expect(res.status).toBe(302)
        expect(res.headers.location).toBe('/employees')
        expect(mockSetActive).not.toHaveBeenCalled()
    })
})
