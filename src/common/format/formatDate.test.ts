import { formatDate } from './formatDate'

describe('formatDate', () => {
    test('formats a Date as dd-Mon-yyyy', () => {
        expect(formatDate(new Date('2023-03-12T00:00:00Z'))).toBe('12 Mar 2023')
    })

    test('formats a date-only string', () => {
        expect(formatDate('2026-01-02')).toBe('02 Jan 2026')
    })

    test('renders in UTC so a late-evening timestamp does not slip to the previous day', () => {
        expect(formatDate('2026-01-02T23:30:00Z')).toBe('02 Jan 2026')
    })

    test('returns a dash for null', () => {
        expect(formatDate(null)).toBe('—')
    })

    test('returns a dash for undefined', () => {
        expect(formatDate(undefined)).toBe('—')
    })

    test('returns a dash for an unparseable string', () => {
        expect(formatDate('not-a-date')).toBe('—')
    })
})
