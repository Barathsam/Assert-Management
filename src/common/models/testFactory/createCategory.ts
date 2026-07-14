import { AssetCategory } from '../../../db/entities'

interface CategoryOverrides {
    code?: string
    name?: string
    description?: string | null
    isActive?: boolean
}

export const createCategoryTest = (overrides: CategoryOverrides = {}) =>
    AssetCategory.create({ code: 'LAP', name: 'Laptop', description: 'Portable computers', ...overrides })
