import type { Response } from 'express'
import type { TxRequest } from '../../transactionMiddleware'
import { dashboardStats } from '../models/dashboardStats'
import { recentActivity } from '../models/recentActivity'

export const dashboard = async (_req: TxRequest, res: Response) => {
    const [stats, recent] = await Promise.all([dashboardStats(), recentActivity()])
    res.render('dashboard', { title: 'Dashboard', stats, recent })
}
