import { createCategoryTest } from '../testFactory/createCategory'
import { toggleCategoryActive } from './toggleCategoryActive'
import { findActiveCategories } from './findActiveCategories'

describe('findActiveCategories', () => {
    test('should return only the active categories', async () => {
        const category = await createCategoryTest()
        await toggleCategoryActive(category)
        await createCategoryTest({ code: 'MOB', name: 'Mobile Phone' })
        const actual = await findActiveCategories()
        expect(actual.map((c) => c.code)).toEqual(['MOB'])
    })

    test('should order the categories by name', async () => {
        await createCategoryTest()
        await createCategoryTest({ code: 'DRL', name: 'Drill Machine' })
        const actual = await findActiveCategories()
        expect(actual.map((c) => c.name)).toEqual(['Drill Machine', 'Laptop'])
    })
})
