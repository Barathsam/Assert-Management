import { parseFormDate, today } from './parseFormDate'

const fallback = new Date('2020-01-01T00:00:00Z')

describe('parseFormDate', () => {
    test('parses a form date at UTC midnight', () => {
        expect(parseFormDate('2026-03-12', fallback).toISOString()).toBe('2026-03-12T00:00:00.000Z')
    })

    test('returns the fallback when the field is absent', () => {
        expect(parseFormDate(undefined, fallback)).toBe(fallback)
    })

    test('returns the fallback when the field is empty', () => {
        expect(parseFormDate('', fallback)).toBe(fallback)
    })

    test('returns the fallback when the value is not a date', () => {
        expect(parseFormDate('12/03/2026', fallback)).toBe(fallback)
    })
})

describe('today', () => {
    test('returns a yyyy-mm-dd string suitable for an input[type=date]', () => {
        expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
})
