import { blankToNull, moneyOrNull, orNull, orZero } from './nullable'

describe('orNull', () => {
    test('returns the value when present', () => {
        expect(orNull('x')).toBe('x')
    })

    test('turns undefined into null so it lands as NULL in the column', () => {
        expect(orNull(undefined)).toBeNull()
    })

    test('keeps a falsy-but-real value such as zero', () => {
        expect(orNull(0)).toBe(0)
    })
})

describe('blankToNull', () => {
    test('turns an empty string into null', () => {
        expect(blankToNull('')).toBeNull()
    })

    test('keeps a real string', () => {
        expect(blankToNull('2027-01-09')).toBe('2027-01-09')
    })
})

describe('orZero', () => {
    test('defaults a missing number to zero', () => {
        expect(orZero(undefined)).toBe(0)
    })

    test('keeps a real number', () => {
        expect(orZero(4500)).toBe(4500)
    })
})

describe('moneyOrNull', () => {
    test('stringifies a number because the column is numeric(12,2)', () => {
        expect(moneyOrNull(82000)).toBe('82000')
    })

    test('returns null when there is no amount', () => {
        expect(moneyOrNull(null)).toBeNull()
    })

    test('keeps zero, which is a real amount and not a missing one', () => {
        expect(moneyOrNull(0)).toBe('0')
    })
})
