import { vi } from 'vitest'

vi.mock('../db', () => ({
    db: () => ({ transaction: (cb: (t: object) => unknown) => cb({}) })
}))
