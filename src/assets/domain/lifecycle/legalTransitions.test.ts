import { isLegalTransition, isTerminal, LEGAL_FROM } from './legalTransitions'

describe('isLegalTransition', () => {
    test('allows issuing an asset that is in stock', () => {
        expect(isLegalTransition('ISSUE', 'IN_STOCK')).toBe(true)
    })

    test('refuses to issue an asset that is already issued', () => {
        expect(isLegalTransition('ISSUE', 'ISSUED')).toBe(false)
    })

    test('refuses to issue an asset that is in repair', () => {
        expect(isLegalTransition('ISSUE', 'IN_REPAIR')).toBe(false)
    })

    test('allows returning an issued asset', () => {
        expect(isLegalTransition('RETURN', 'ISSUED')).toBe(true)
    })

    test('refuses to return an asset nobody is holding', () => {
        expect(isLegalTransition('RETURN', 'IN_STOCK')).toBe(false)
    })

    test('allows completing a repair only from IN_REPAIR', () => {
        expect(isLegalTransition('REPAIR_COMPLETE', 'IN_REPAIR')).toBe(true)
        expect(isLegalTransition('REPAIR_COMPLETE', 'IN_STOCK')).toBe(false)
    })

    test('allows scrapping from stock and from repair', () => {
        expect(isLegalTransition('SCRAP', 'IN_STOCK')).toBe(true)
        expect(isLegalTransition('SCRAP', 'IN_REPAIR')).toBe(true)
    })

    test('refuses to scrap an asset that is still issued', () => {
        expect(isLegalTransition('SCRAP', 'ISSUED')).toBe(false)
    })

    test('refuses every action on a scrapped asset', () => {
        const actions = Object.keys(LEGAL_FROM) as (keyof typeof LEGAL_FROM)[]
        actions.forEach((action) => expect(isLegalTransition(action, 'SCRAPPED')).toBe(false))
    })
})

describe('isTerminal', () => {
    test('treats SCRAPPED as terminal', () => {
        expect(isTerminal('SCRAPPED')).toBe(true)
    })

    test('treats every other status as non-terminal', () => {
        expect(isTerminal('IN_STOCK')).toBe(false)
        expect(isTerminal('ISSUED')).toBe(false)
        expect(isTerminal('IN_REPAIR')).toBe(false)
    })
})
