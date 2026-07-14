import type { Response } from 'express'
import { today } from '../../common/format/parseFormDate'
import type { Employee } from '../../db/entities'
import type { TxRequest } from '../../transactionMiddleware'
import { canDeactivate } from '../domain/canDeactivate'
import { findEmployeeWithHeldAssets } from '../models/employee/findEmployeeWithHeldAssets'
import { setActive } from '../models/employee/setActive'
import { employeeNotFound } from './employeeNotFound'

const heldCount = (employee: Employee) => employee.heldAssets?.length ?? 0

const nameOf = (employee: Employee) => `${employee.firstName} ${employee.lastName}`

const blocked = (req: TxRequest, res: Response, employee: Employee) => {
    const held = heldCount(employee)
    req.flash('error', `${nameOf(employee)} still holds ${held} asset(s). Return them before deactivating.`)
    res.redirect(`/employees/${employee.id}`)
}

const deactivate = async (req: TxRequest, res: Response, employee: Employee) => {
    await setActive(employee, false, today(), req.transactionClient)
    req.flash('success', `${nameOf(employee)} deactivated.`)
    res.redirect(`/employees/${employee.id}`)
}

export const deactivateEmployeeController = async (req: TxRequest, res: Response) => {
    const employee = await findEmployeeWithHeldAssets(Number(req.params.id), req.transactionClient)
    if (!employee) return employeeNotFound(req, res)
    return canDeactivate(heldCount(employee)) ? deactivate(req, res, employee) : blocked(req, res, employee)
}
