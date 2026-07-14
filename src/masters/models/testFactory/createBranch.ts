import { seedBranchData } from '../../seed/branch'
import type { BranchFields } from '../../types/masterTypes'
import { createBranch } from '../branch/createBranch'

export const createBranchTest = (overrides: Partial<BranchFields> = {}) =>
    createBranch({ ...seedBranchData, ...overrides })
