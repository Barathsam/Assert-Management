import { assertTransition } from './assertTransition'

describe('assertTransition', () => {
    test('permits a legal transition', () => {
        expect(() => assertTransition('ISSUE', 'IN_STOCK', 'LAP-BLR-000001')).not.toThrow()
    })

    test('names the current status when the transition is illegal', () => {
        expect(() => assertTransition('ISSUE', 'ISSUED', 'LAP-BLR-000001')).toThrowError(
            'Cannot issue LAP-BLR-000001: it is currently Issued.'
        )
    })

    test('explains that scrapping is final rather than reporting a generic illegal move', () => {
        expect(() => assertTransition('ISSUE', 'SCRAPPED', 'LAP-BLR-000001')).toThrowError(/Scrapping is final/)
    })

    test('refuses to scrap an asset that is still issued', () => {
        expect(() => assertTransition('SCRAP', 'ISSUED', 'LAP-BLR-000001')).toThrowError(
            'Cannot scrap LAP-BLR-000001: it is currently Issued.'
        )
    })

    test('refuses to complete a repair on an asset that is in stock', () => {
        expect(() => assertTransition('REPAIR_COMPLETE', 'IN_STOCK', 'LAP-BLR-000001')).toThrowError(
            'Cannot repair complete LAP-BLR-000001: it is currently In Stock.'
        )
    })
})
