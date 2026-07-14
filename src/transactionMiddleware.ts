import type { NextFunction, Request, RequestHandler, Response } from 'express'
import type { Transaction } from 'sequelize'
import { db } from './db'
import { renderError } from './errorHandler'

export type TxRequest = Request & { transactionClient: Transaction }

export type HandlerType = (req: TxRequest, res: Response, next: NextFunction) => Promise<unknown> | unknown

export const transactionMiddleware =
    (handler: HandlerType): RequestHandler =>
    async (req, res, next) => {
        await db()
            .transaction(async (transaction) => {
                ;(req as TxRequest).transactionClient = transaction
                await handler(req as TxRequest, res, next)
            })
            .catch((e: Error) => renderError(e, res))
    }
