import { UniqueConstraintError } from 'sequelize'
import { seedCategoryData } from '../../seed/category'
import { createCategoryTest } from '../testFactory/createCategory'
import { updateCategory } from './updateCategory'

describe('updateCategory', () => {
    test('should overwrite the editable fields', async () => {
        const category = await createCategoryTest()
        const actual = await updateCategory(category, { ...seedCategoryData, name: 'Notebook', description: 'Kit' })
        expect(actual.name).toBe('Notebook')
        expect(actual.description).toBe('Kit')
    })

    test('should uppercase the code on write', async () => {
        const category = await createCategoryTest()
        const actual = await updateCategory(category, { ...seedCategoryData, code: 'mob' })
        expect(actual.code).toBe('MOB')
    })

    test('should not change the active flag', async () => {
        const category = await createCategoryTest()
        const actual = await updateCategory(category, { ...seedCategoryData, name: 'Renamed' })
        expect(actual.isActive).toBe(true)
    })

    test('should reject a code that another category already uses', async () => {
        await createCategoryTest()
        const second = await createCategoryTest({ code: 'MOB', name: 'Mobile Phone' })
        const clash = updateCategory(second, { ...seedCategoryData, name: 'Mobile Phone' })
        await expect(clash).rejects.toBeInstanceOf(UniqueConstraintError)
    })
})
