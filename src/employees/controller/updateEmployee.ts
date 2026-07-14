import type { Response } from 'express'
import type { Employee } from '../../db/entities'
import type { TxRequest } from '../../transactionMiddleware'
import { updateEmployee } from '../models/employee/updateEmployee'
import { findEmployeeById } from '../models/employee/findEmployeeById'
import type { EmployeeFields } from '../types/employeeTypes'
import { duplicateEmployee } from './duplicateEmployee'
import { employeeNotFound } from './employeeNotFound'

const saved = (req: TxRequest, res: Response, employee: Employee) => {
    req.flash('success', 'Employee updated.')
    res.redirect(`/employees/${employee.id}`)
}

const save = (req: TxRequest, res: Response, employee: Employee) =>
    updateEmployee(employee, req.body as EmployeeFields, req.transactionClient)
        .then(() => saved(req, res, employee))
        .catch((error: unknown) => duplicateEmployee(req, res, `/employees/${employee.id}/edit`, error))

export const updateEmployeeController = async (req: TxRequest, res: Response) => {
    const employee = await findEmployeeById(Number(req.params.id), req.transactionClient)
    return employee ? save(req, res, employee) : employeeNotFound(req, res)
}
