import { formatCurrency } from './formatCurrency'

describe('formatCurrency', () => {
    test('formats a number as rupees with no decimals', () => {
        expect(formatCurrency(82000)).toBe('₹82,000')
    })

    test('formats the string Sequelize returns for a DECIMAL column', () => {
        expect(formatCurrency('82000.00')).toBe('₹82,000')
    })

    test('uses the Indian grouping convention', () => {
        expect(formatCurrency(1582000)).toBe('₹15,82,000')
    })

    test('formats zero rather than treating it as missing', () => {
        expect(formatCurrency(0)).toBe('₹0')
    })

    test('returns a dash for null', () => {
        expect(formatCurrency(null)).toBe('—')
    })

    test('returns a dash for undefined', () => {
        expect(formatCurrency(undefined)).toBe('—')
    })

    test('returns a dash for an empty string', () => {
        expect(formatCurrency('')).toBe('—')
    })

    test('returns a dash for a value that is not a number', () => {
        expect(formatCurrency('not-a-number')).toBe('—')
    })
})
