import path from 'node:path'
import express, { type NextFunction, type Request, type Response } from 'express'
import session from 'express-session'
import flash from 'connect-flash'
import morgan from 'morgan'
import './db/entities'
import { renderError } from './errorHandler'
import { setRoutes } from './setRoutes'
import { mountStatic } from './staticAssets'
import { viewLocals } from './viewLocals'

const root = path.resolve(__dirname, '..')

export const app = express()

app.set('views', path.join(root, 'src', 'views'))
app.set('view engine', 'pug')

app.use(morgan('dev', { skip: () => process.env.NODE_ENV === 'test' }))
app.use(express.urlencoded({ extended: false }))
mountStatic(app, root)
app.use(session({ secret: process.env.SESSION_SECRET ?? 'dev-secret', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(viewLocals)

setRoutes(app)

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => renderError(err, res))
