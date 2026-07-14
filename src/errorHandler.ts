import type { Response } from 'express'
import { BusinessRuleError } from './common/errors/businessRuleError'

const statusFor = (error: Error): number => (error instanceof BusinessRuleError ? 400 : 500)

const titleFor = (error: Error): string =>
    error instanceof BusinessRuleError ? 'Cannot do that' : 'Something went wrong'

export const renderError = (error: Error, res: Response, code?: number): void => {
    res.status(code ?? statusFor(error)).render('error', {
        title: titleFor(error),
        message: error.message
    })
}

export const throwError = (error: Error): never => {
    throw error
}
