import { createCategoryTest } from '../testFactory/createCategory'
import { findCategoryById } from './findCategoryById'
import { toggleCategoryActive } from './toggleCategoryActive'

describe('toggleCategoryActive', () => {
    test('should deactivate an active category', async () => {
        const category = await createCategoryTest()
        const actual = await toggleCategoryActive(category)
        expect(actual.isActive).toBe(false)
    })

    test('should reactivate a deactivated category', async () => {
        const category = await createCategoryTest()
        await toggleCategoryActive(category)
        const actual = await toggleCategoryActive(category)
        expect(actual.isActive).toBe(true)
    })

    test('should deactivate rather than delete the category', async () => {
        const category = await createCategoryTest()
        await toggleCategoryActive(category)
        expect(await findCategoryById(category.id)).not.toBeNull()
    })
})
