import type { Router } from 'express'
import type { Schema } from 'joi'
import { transactionMiddleware, type HandlerType } from './transactionMiddleware'
import { validateRequest } from './validationMiddleware'

export const routerPost = (router: Router, url: string, schema: Schema, controller: HandlerType) =>
    router.post(url, validateRequest(schema), transactionMiddleware(controller))

export const routerGet = (router: Router, url: string, controller: HandlerType) =>
    router.get(url, transactionMiddleware(controller))
