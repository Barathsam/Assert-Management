import type { Router } from 'express'
import { routerGet, routerPost } from '../../routerMethods'
import { createBranchController } from '../controller/branch/createBranch'
import { listBranches } from '../controller/branch/listBranches'
import { toggleBranchController } from '../controller/branch/toggleBranch'
import { updateBranchController } from '../controller/branch/updateBranch'
import { branchSchema, branchToggleSchema } from '../validation/branchSchemas'

export const registerBranchRoutes = (router: Router) => {
    routerGet(router, '/branches', listBranches)
    routerPost(router, '/branches', branchSchema, createBranchController)
    routerPost(router, '/branches/:id', branchSchema, updateBranchController)
    routerPost(router, '/branches/:id/toggle', branchToggleSchema, toggleBranchController)
}
