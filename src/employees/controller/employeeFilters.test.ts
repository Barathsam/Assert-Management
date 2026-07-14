import { Op } from 'sequelize'
import { employeeFilters } from './employeeFilters'

const noSearch = { branchId: undefined, q: '' }

describe('employeeFilters', () => {
    test('should restrict to active employees when the status is active', () => {
        expect(employeeFilters({ ...noSearch, status: 'active' })).toEqual({ isActive: true })
    })

    test('should restrict to inactive employees when the status is inactive', () => {
        expect(employeeFilters({ ...noSearch, status: 'inactive' })).toEqual({ isActive: false })
    })

    test('should not filter on the active flag when the status is all', () => {
        expect(employeeFilters({ ...noSearch, status: 'all' })).toEqual({})
    })

    test('should ignore a status that is not a real status', () => {
        expect(employeeFilters({ ...noSearch, status: 'banana' })).toEqual({})
    })

    test('should filter by branch when a branch is chosen', () => {
        expect(employeeFilters({ ...noSearch, status: 'all', branchId: 3 })).toEqual({ branchId: 3 })
    })

    test('should search name, code, email and designation', () => {
        const where = employeeFilters({ status: 'all', branchId: undefined, q: 'ash' }) as Record<symbol, unknown[]>
        expect(where[Op.or]).toEqual([
            { firstName: { [Op.iLike]: '%ash%' } },
            { lastName: { [Op.iLike]: '%ash%' } },
            { employeeCode: { [Op.iLike]: '%ash%' } },
            { email: { [Op.iLike]: '%ash%' } },
            { designation: { [Op.iLike]: '%ash%' } }
        ])
    })

    test('should ignore a blank search box', () => {
        expect(employeeFilters({ ...noSearch, status: 'all', q: '' })).toEqual({})
    })

    test('should combine the status, branch and search filters', () => {
        const where = employeeFilters({ status: 'active', branchId: 2, q: 'x' }) as Record<string | symbol, unknown>
        expect(where.isActive).toBe(true)
        expect(where.branchId).toBe(2)
        expect(where[Op.or]).toBeDefined()
    })
})
