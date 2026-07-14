import { createBranchTest } from '../testFactory/createBranch'
import { findBranchById } from './findBranchById'
import { toggleBranchActive } from './toggleBranchActive'

describe('toggleBranchActive', () => {
    test('should deactivate an active branch', async () => {
        const branch = await createBranchTest()
        const actual = await toggleBranchActive(branch)
        expect(actual.isActive).toBe(false)
    })

    test('should reactivate a deactivated branch', async () => {
        const branch = await createBranchTest()
        await toggleBranchActive(branch)
        const actual = await toggleBranchActive(branch)
        expect(actual.isActive).toBe(true)
    })

    test('should deactivate rather than delete the branch', async () => {
        const branch = await createBranchTest()
        await toggleBranchActive(branch)
        expect(await findBranchById(branch.id)).not.toBeNull()
    })
})
