import { issueAsset } from './issueAsset'

const mockFindEmployeeById = vi.fn()
const mockApplyTransition = vi.fn()

vi.mock('../../employees/models/employee/findEmployeeById', () => ({
    findEmployeeById: (id: number, tx: object) => mockFindEmployeeById(id, tx)
}))
vi.mock('./applyTransition', () => ({
    applyTransition: (input: object, tx: object) => mockApplyTransition(input, tx)
}))

const tx = {} as never
const txnAt = new Date('2026-02-01T00:00:00Z')
const active = { id: 42, firstName: 'Priya', lastName: 'Sharma', isActive: true }
const inactive = { ...active, isActive: false }

describe('issueAsset', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockApplyTransition.mockResolvedValue({ id: 7, assetTag: 'LAP-BLR-000007' })
    })

    test('should issue to an active employee and record the holder on the asset', async () => {
        mockFindEmployeeById.mockResolvedValue(active)
        await issueAsset(7, { employeeId: 42, txnAt }, tx)
        const input = mockApplyTransition.mock.calls[0]?.[0] as { mutate: (a: object) => void; action: string }
        expect(input.action).toBe('ISSUE')
        const asset = { currentHolderId: null }
        input.mutate(asset)
        expect(asset.currentHolderId).toBe(42)
    })

    test('should refuse to issue to an inactive employee even if the form names one', async () => {
        mockFindEmployeeById.mockResolvedValue(inactive)
        await expect(issueAsset(7, { employeeId: 42, txnAt }, tx)).rejects.toThrowError(
            'Priya Sharma is inactive and cannot be issued assets.'
        )
        expect(mockApplyTransition).not.toHaveBeenCalled()
    })

    test('should fail when the employee does not exist', async () => {
        mockFindEmployeeById.mockResolvedValue(null)
        await expect(issueAsset(7, { employeeId: 99, txnAt }, tx)).rejects.toThrowError('Employee not found.')
        expect(mockApplyTransition).not.toHaveBeenCalled()
    })
})
