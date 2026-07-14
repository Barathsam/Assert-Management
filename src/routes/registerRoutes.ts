import { Router } from 'express'
import { registerApiRoutes } from '../api/routes/apiRoutes'
import { registerAssetRoutes } from '../assets/routes/assetRoutes'
import { registerTransactionRoutes } from '../assets/routes/transactionRoutes'
import { registerDashboardRoutes } from '../dashboard/routes/dashboardRoutes'
import { registerEmployeeRoutes } from '../employees/routes/employeeRoutes'
import { registerBranchRoutes } from '../masters/routes/branchRoutes'
import { registerCategoryRoutes } from '../masters/routes/categoryRoutes'
import { registerReportRoutes } from '../reports/routes/reportRoutes'
import { registerStockRoutes } from '../stock/routes/stockRoutes'

const allRegistrars = [
    registerDashboardRoutes,
    registerAssetRoutes,
    registerTransactionRoutes,
    registerEmployeeRoutes,
    registerBranchRoutes,
    registerCategoryRoutes,
    registerStockRoutes,
    registerReportRoutes,
    registerApiRoutes
]

export const routes = Router()

allRegistrars.forEach((register) => register(routes))
