import type { Router } from 'express'
import { routerGet } from '../../routerMethods'
import { assetHistory } from '../controller/assetHistory'
import { integrity } from '../controller/integrity'
import { ledger } from '../controller/ledger'
import { reportsIndex } from '../controller/reportsIndex'
import { scrapRegister } from '../controller/scrapRegister'

export const registerReportRoutes = (router: Router): void => {
    routerGet(router, '/reports', reportsIndex)
    routerGet(router, '/reports/scrapped', scrapRegister)
    routerGet(router, '/reports/ledger', ledger)
    routerGet(router, '/reports/integrity', integrity)
    routerGet(router, '/reports/history/:id', assetHistory)
}
