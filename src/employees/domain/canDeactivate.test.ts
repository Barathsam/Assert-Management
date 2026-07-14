import { canDeactivate } from './canDeactivate'

describe('canDeactivate', () => {
    test('returns true for an employee holding nothing', () => {
        expect(canDeactivate(0)).toBe(true)
    })

    test('returns false for an employee still holding one asset', () => {
        expect(canDeactivate(1)).toBe(false)
    })

    test('returns false for an employee still holding several assets', () => {
        expect(canDeactivate(4)).toBe(false)
    })
})
