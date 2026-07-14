import type { Router } from 'express'
import { routerGet, routerPost } from '../../routerMethods'
import { createCategoryController } from '../controller/category/createCategory'
import { listCategories } from '../controller/category/listCategories'
import { toggleCategoryController } from '../controller/category/toggleCategory'
import { updateCategoryController } from '../controller/category/updateCategory'
import { categorySchema, categoryToggleSchema } from '../validation/categorySchemas'

export const registerCategoryRoutes = (router: Router) => {
    routerGet(router, '/categories', listCategories)
    routerPost(router, '/categories', categorySchema, createCategoryController)
    routerPost(router, '/categories/:id', categorySchema, updateCategoryController)
    routerPost(router, '/categories/:id/toggle', categoryToggleSchema, toggleCategoryController)
}
