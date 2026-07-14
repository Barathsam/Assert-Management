import { createBranchTest } from '../testFactory/createBranch'
import { findBranchById } from './findBranchById'

describe('findBranchById', () => {
    test('should return the branch when the id is known', async () => {
        const branch = await createBranchTest()
        const actual = await findBranchById(branch.id)
        expect(actual?.code).toBe('BLR')
    })

    test('should return null when the id is unknown', async () => {
        expect(await findBranchById(9999)).toBeNull()
    })
})
