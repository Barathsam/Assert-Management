import type { Express, Request, Response } from 'express'
import { routes } from './routes/registerRoutes'

const healthRoute = (app: Express) => app.get('/healthz', (_req: Request, res: Response) => res.json({ ok: true }))

const nonExistingRoute = (app: Express) =>
    app.use((_req: Request, res: Response) =>
        res.status(404).render('error', { title: 'Not found', message: 'That page does not exist.' })
    )

export const setRoutes = (app: Express): void => {
    healthRoute(app)
    app.use('/', routes)
    nonExistingRoute(app)
}
