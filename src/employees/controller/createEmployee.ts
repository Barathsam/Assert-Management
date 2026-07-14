import type { Response } from 'express'
import type { Employee } from '../../db/entities'
import type { TxRequest } from '../../transactionMiddleware'
import { createEmployee } from '../models/employee/createEmployee'
import type { EmployeeFields } from '../types/employeeTypes'
import { duplicateEmployee } from './duplicateEmployee'

const added = (req: TxRequest, res: Response, employee: Employee) => {
    req.flash('success', `${employee.firstName} ${employee.lastName} added.`)
    res.redirect(`/employees/${employee.id}`)
}

export const createEmployeeController = (req: TxRequest, res: Response) =>
    createEmployee(req.body as EmployeeFields, req.transactionClient)
        .then((employee) => added(req, res, employee))
        .catch((error: unknown) => duplicateEmployee(req, res, '/employees/new', error))
