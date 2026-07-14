import { createCategoryTest } from '../testFactory/createCategory'
import { findCategoryById } from './findCategoryById'

describe('findCategoryById', () => {
    test('should return the category when the id is known', async () => {
        const category = await createCategoryTest()
        const actual = await findCategoryById(category.id)
        expect(actual?.code).toBe('LAP')
    })

    test('should return null when the id is unknown', async () => {
        expect(await findCategoryById(9999)).toBeNull()
    })
})
