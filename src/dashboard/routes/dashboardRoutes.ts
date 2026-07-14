import type { Router } from 'express'
import { routerGet } from '../../routerMethods'
import { dashboard } from '../controller/dashboard'

export const registerDashboardRoutes = (router: Router): void => {
    routerGet(router, '/', dashboard)
}
