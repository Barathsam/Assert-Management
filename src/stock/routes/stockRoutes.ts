import type { Router } from 'express'
import { routerGet } from '../../routerMethods'
import { stockView } from '../controller/stockView'

export const registerStockRoutes = (router: Router): void => {
    routerGet(router, '/stock', stockView)
}
