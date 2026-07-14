import { Branch } from '../../../db/entities'

interface BranchOverrides {
    code?: string
    name?: string
    city?: string | null
    state?: string | null
    isActive?: boolean
}

export const createBranchTest = (overrides: BranchOverrides = {}) =>
    Branch.create({ code: 'BLR', name: 'Bangalore HQ', city: 'Bangalore', state: 'Karnataka', ...overrides })
