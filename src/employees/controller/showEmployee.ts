import type { Response } from 'express'
import type { TxRequest } from '../../transactionMiddleware'
import { findEmployeeWithHeldAssets } from '../models/employee/findEmployeeWithHeldAssets'
import { employeeNotFound } from './employeeNotFound'

export const showEmployee = async (req: TxRequest, res: Response) => {
    const employee = await findEmployeeWithHeldAssets(Number(req.params.id), req.transactionClient)
    if (!employee) return employeeNotFound(req, res)
    res.render('employees/detail', { title: `${employee.firstName} ${employee.lastName}`, employee })
}
