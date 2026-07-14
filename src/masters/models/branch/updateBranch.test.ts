import { UniqueConstraintError } from 'sequelize'
import { seedBranchData } from '../../seed/branch'
import { createBranchTest } from '../testFactory/createBranch'
import { updateBranch } from './updateBranch'

describe('updateBranch', () => {
    test('should overwrite the editable fields', async () => {
        const branch = await createBranchTest()
        const actual = await updateBranch(branch, { ...seedBranchData, name: 'Bangalore North', city: 'Yelahanka' })
        expect(actual.name).toBe('Bangalore North')
        expect(actual.city).toBe('Yelahanka')
    })

    test('should uppercase the code on write', async () => {
        const branch = await createBranchTest()
        const actual = await updateBranch(branch, { ...seedBranchData, code: 'hyd' })
        expect(actual.code).toBe('HYD')
    })

    test('should not change the active flag', async () => {
        const branch = await createBranchTest()
        const actual = await updateBranch(branch, { ...seedBranchData, name: 'Renamed' })
        expect(actual.isActive).toBe(true)
    })

    test('should reject a code that another branch already uses', async () => {
        await createBranchTest()
        const second = await createBranchTest({ code: 'MAA', name: 'Chennai' })
        const clash = updateBranch(second, { ...seedBranchData, code: 'BLR' })
        await expect(clash).rejects.toBeInstanceOf(UniqueConstraintError)
    })
})
