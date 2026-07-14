import type { NextFunction, Request, Response } from 'express'
import type { Schema } from 'joi'
import { BusinessRuleError } from './common/errors/businessRuleError'
import { renderError } from './errorHandler'

export const validateRequest = (schema: Schema) => (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: true, convert: true })
    if (error) return renderError(new BusinessRuleError(error.message), res)
    req.body = value
    next()
}
