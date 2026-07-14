import { createCategoryTest } from '../testFactory/createCategory'
import { toggleCategoryActive } from './toggleCategoryActive'
import { findCategories } from './findCategories'

describe('findCategories', () => {
    test('should return every category ordered by name', async () => {
        await createCategoryTest()
        await createCategoryTest({ code: 'DRL', name: 'Drill Machine' })
        const actual = await findCategories()
        expect(actual.map((c) => c.name)).toEqual(['Drill Machine', 'Laptop'])
    })

    test('should include deactivated categories, which are never deleted', async () => {
        const category = await createCategoryTest()
        await toggleCategoryActive(category)
        const actual = await findCategories()
        expect(actual.map((c) => c.code)).toEqual(['LAP'])
    })

    test('should return an empty list when there are no categories', async () => {
        expect(await findCategories()).toEqual([])
    })
})
