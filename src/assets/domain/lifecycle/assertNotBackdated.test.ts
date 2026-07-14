import { assertNotBackdated } from './assertNotBackdated'

const march = new Date('2026-03-01T00:00:00Z')
const february = new Date('2026-02-01T00:00:00Z')

describe('assertNotBackdated', () => {
    test('permits an event after the asset last event', () => {
        expect(() => assertNotBackdated(march, february)).not.toThrow()
    })

    test('permits an event on the same instant as the last event', () => {
        expect(() => assertNotBackdated(march, march)).not.toThrow()
    })

    test('permits the first event on an asset that has no history yet', () => {
        expect(() => assertNotBackdated(february, null)).not.toThrow()
    })

    test('rejects an event dated before the last one, which would make a holding span negative', () => {
        expect(() => assertNotBackdated(february, march)).toThrowError(
            "Date cannot be earlier than the asset's last event (2026-03-01)."
        )
    })
})
