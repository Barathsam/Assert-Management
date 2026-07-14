import { Op } from 'sequelize'
import { assetFilters } from './assetFilters'

describe('assetFilters', () => {
    test('returns an empty clause when nothing is filtered', () => {
        expect(assetFilters({})).toEqual({})
    })

    test('filters by asset type', () => {
        expect(assetFilters({ categoryId: '3' })).toEqual({ categoryId: 3 })
    })

    test('filters by branch', () => {
        expect(assetFilters({ branchId: '2' })).toEqual({ branchId: 2 })
    })

    test('filters by a valid status', () => {
        expect(assetFilters({ status: 'IN_REPAIR' })).toEqual({ status: 'IN_REPAIR' })
    })

    test('ignores a status that is not a real asset status', () => {
        expect(assetFilters({ status: 'BANANA' })).toEqual({})
    })

    test('ignores a non-numeric id rather than passing it to the query', () => {
        expect(assetFilters({ categoryId: 'abc', branchId: '0' })).toEqual({})
    })

    test('searches make, model, serial and tag', () => {
        const where = assetFilters({ q: 'dell' }) as Record<symbol, unknown[]>
        expect(where[Op.or]).toEqual([
            { make: { [Op.iLike]: '%dell%' } },
            { model: { [Op.iLike]: '%dell%' } },
            { serialNumber: { [Op.iLike]: '%dell%' } },
            { assetTag: { [Op.iLike]: '%dell%' } }
        ])
    })

    test('ignores a blank search box', () => {
        expect(assetFilters({ q: '   ' })).toEqual({})
    })

    test('combines a type filter with a search', () => {
        const where = assetFilters({ categoryId: '1', q: 'x' }) as Record<string | symbol, unknown>
        expect(where.categoryId).toBe(1)
        expect(where[Op.or]).toBeDefined()
    })
})
