import { returnTarget } from './returnTarget'

describe('returnTarget', () => {
    test('sends a repair return to IN_REPAIR, not back into stock', () => {
        expect(returnTarget('REPAIR')).toBe('IN_REPAIR')
    })

    test('sends a damaged return to IN_REPAIR, not back into stock', () => {
        expect(returnTarget('DAMAGED')).toBe('IN_REPAIR')
    })

    test('returns an upgrade to stock', () => {
        expect(returnTarget('UPGRADE')).toBe('IN_STOCK')
    })

    test('returns a resignation to stock', () => {
        expect(returnTarget('RESIGNATION')).toBe('IN_STOCK')
    })

    test('returns a project end to stock', () => {
        expect(returnTarget('PROJECT_END')).toBe('IN_STOCK')
    })

    test('returns a not-required to stock', () => {
        expect(returnTarget('NOT_REQUIRED')).toBe('IN_STOCK')
    })

    test('returns other to stock', () => {
        expect(returnTarget('OTHER')).toBe('IN_STOCK')
    })
})
