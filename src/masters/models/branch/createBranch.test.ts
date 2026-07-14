import { UniqueConstraintError } from 'sequelize'
import { seedBranchData } from '../../seed/branch'
import { createBranchTest } from '../testFactory/createBranch'
import { createBranch } from './createBranch'

describe('createBranch', () => {
    test('should create a branch with the given details', async () => {
        const actual = await createBranch(seedBranchData)
        expect(actual).toMatchObject({ code: 'BLR', name: 'Bangalore HQ', city: 'Bengaluru' })
    })

    test('should start a branch active', async () => {
        const actual = await createBranchTest()
        expect(actual.isActive).toBe(true)
    })

    test('should uppercase the code on write', async () => {
        const actual = await createBranch({ ...seedBranchData, code: 'maa' })
        expect(actual.code).toBe('MAA')
    })

    test('should reject a duplicate code', async () => {
        await createBranchTest()
        await expect(createBranchTest({ name: 'Another' })).rejects.toBeInstanceOf(UniqueConstraintError)
    })

    test('should treat a lowercase code as a duplicate of the uppercase one', async () => {
        await createBranchTest()
        await expect(createBranchTest({ code: 'blr' })).rejects.toBeInstanceOf(UniqueConstraintError)
    })

    test('should allow city and state to be null', async () => {
        const actual = await createBranch({ ...seedBranchData, city: null, state: null })
        expect(actual.city).toBeNull()
        expect(actual.state).toBeNull()
    })
})
