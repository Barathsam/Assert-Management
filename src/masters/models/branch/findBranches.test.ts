import { createBranchTest } from '../testFactory/createBranch'
import { toggleBranchActive } from './toggleBranchActive'
import { findBranches } from './findBranches'

describe('findBranches', () => {
    test('should return every branch ordered by name', async () => {
        await createBranchTest()
        await createBranchTest({ code: 'MAA', name: 'Chennai' })
        const actual = await findBranches()
        expect(actual.map((b) => b.name)).toEqual(['Bangalore HQ', 'Chennai'])
    })

    test('should include deactivated branches, which are never deleted', async () => {
        const branch = await createBranchTest()
        await toggleBranchActive(branch)
        const actual = await findBranches()
        expect(actual.map((b) => b.code)).toEqual(['BLR'])
    })

    test('should return an empty list when there are no branches', async () => {
        expect(await findBranches()).toEqual([])
    })
})
