import type { Router } from 'express'
import { routerGet } from '../../routerMethods'
import { assetsJsonController } from '../controller/assetsJson'
import { employeesJsonController } from '../controller/employeesJson'
import { stockJsonController } from '../controller/stockJson'

export const registerApiRoutes = (router: Router) => {
    routerGet(router, '/api/assets', assetsJsonController)
    routerGet(router, '/api/employees', employeesJsonController)
    routerGet(router, '/api/stock', stockJsonController)
}
