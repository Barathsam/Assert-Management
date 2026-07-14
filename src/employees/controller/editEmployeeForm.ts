import type { Response } from 'express'
import { today } from '../../common/format/parseFormDate'
import { findActiveBranches } from '../../masters/models/branch/findActiveBranches'
import type { TxRequest } from '../../transactionMiddleware'
import { findEmployeeById } from '../models/employee/findEmployeeById'
import { employeeNotFound } from './employeeNotFound'

export const editEmployeeForm = async (req: TxRequest, res: Response) => {
    const [employee, branches] = await Promise.all([
        findEmployeeById(Number(req.params.id), req.transactionClient),
        findActiveBranches(req.transactionClient)
    ])
    if (!employee) return employeeNotFound(req, res)
    res.render('employees/form', {
        title: `Edit ${employee.firstName} ${employee.lastName}`,
        employee,
        branches,
        today: today()
    })
}
