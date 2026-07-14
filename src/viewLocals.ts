import type { NextFunction, Request, Response } from 'express'
import { formatCurrency } from './common/format/formatCurrency'
import { formatDate } from './common/format/formatDate'
import { RETURN_REASON_LABEL, STATUS_BADGE, STATUS_LABEL, TXN_LABEL } from './common/labels/labels'

export const viewLocals = (req: Request, res: Response, next: NextFunction) => {
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    res.locals.currentPath = req.path
    Object.assign(res.locals, {
        STATUS_LABEL,
        STATUS_BADGE,
        TXN_LABEL,
        RETURN_REASON_LABEL,
        money: formatCurrency,
        date: formatDate
    })
    next()
}
