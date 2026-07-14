import { UniqueConstraintError } from 'sequelize'
import { seedCategoryData } from '../../seed/category'
import { createCategoryTest } from '../testFactory/createCategory'
import { createCategory } from './createCategory'

describe('createCategory', () => {
    test('should create a category with the given details', async () => {
        const actual = await createCategory(seedCategoryData)
        expect(actual).toMatchObject({ code: 'LAP', name: 'Laptop' })
    })

    test('should start a category active', async () => {
        const actual = await createCategoryTest()
        expect(actual.isActive).toBe(true)
    })

    test('should uppercase the code on write', async () => {
        const actual = await createCategory({ ...seedCategoryData, code: 'mob' })
        expect(actual.code).toBe('MOB')
    })

    test('should reject a duplicate code', async () => {
        await createCategoryTest()
        await expect(createCategoryTest({ name: 'Notebook' })).rejects.toBeInstanceOf(UniqueConstraintError)
    })

    test('should reject a duplicate name', async () => {
        await createCategoryTest()
        await expect(createCategoryTest({ code: 'NB' })).rejects.toBeInstanceOf(UniqueConstraintError)
    })

    test('should allow the description to be null', async () => {
        const actual = await createCategory({ ...seedCategoryData, description: null })
        expect(actual.description).toBeNull()
    })
})
