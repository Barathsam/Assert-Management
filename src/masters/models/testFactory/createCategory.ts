import { seedCategoryData } from '../../seed/category'
import type { CategoryFields } from '../../types/masterTypes'
import { createCategory } from '../category/createCategory'

export const createCategoryTest = (overrides: Partial<CategoryFields> = {}) =>
    createCategory({ ...seedCategoryData, ...overrides })
