import { utilisation } from './utilisation'
import type { HoldingInterval } from '../types/holdingInterval'

const holding = (days: number): HoldingInterval => ({
    employeeId: 1,
    employeeName: 'Asha Kumar',
    employeeCode: 'E1',
    issuedAt: new Date('2024-01-01T00:00:00Z'),
    returnedAt: null,
    returnReason: null,
    days
})

describe('utilisation', () => {
    test('is zero when the asset was never issued', () => {
        expect(utilisation([], 100)).toEqual({ daysIssued: 0, utilisationPct: 0 })
    })

    test('sums every holding into the days issued', () => {
        expect(utilisation([holding(10), holding(15)], 100)).toEqual({ daysIssued: 25, utilisationPct: 25 })
    })

    test('rounds the percentage to a whole number', () => {
        expect(utilisation([holding(1)], 3).utilisationPct).toBe(33)
    })

    test('does not divide by zero on the day an asset is bought', () => {
        expect(utilisation([holding(0)], 0)).toEqual({ daysIssued: 0, utilisationPct: 0 })
    })

    test('adds days numerically when they arrive as strings', () => {
        const stringy = [
            { ...holding(0), days: '10' as unknown as number },
            { ...holding(0), days: '15' as unknown as number }
        ]

        expect(utilisation(stringy, '100' as unknown as number)).toEqual({ daysIssued: 25, utilisationPct: 25 })
    })
})
