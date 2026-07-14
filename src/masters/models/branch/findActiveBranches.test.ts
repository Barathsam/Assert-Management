import { createBranchTest } from '../testFactory/createBranch'
import { toggleBranchActive } from './toggleBranchActive'
import { findActiveBranches } from './findActiveBranches'

describe('findActiveBranches', () => {
    test('should return only the active branches', async () => {
        const branch = await createBranchTest()
        await toggleBranchActive(branch)
        await createBranchTest({ code: 'MAA', name: 'Chennai' })
        const actual = await findActiveBranches()
        expect(actual.map((b) => b.code)).toEqual(['MAA'])
    })

    test('should order the branches by name', async () => {
        await createBranchTest({ code: 'MAA', name: 'Chennai' })
        await createBranchTest()
        const actual = await findActiveBranches()
        expect(actual.map((b) => b.name)).toEqual(['Bangalore HQ', 'Chennai'])
    })
})
