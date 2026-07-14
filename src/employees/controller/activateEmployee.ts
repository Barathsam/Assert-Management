import type { Response } from 'express'
import type { Employee } from '../../db/entities'
import type { TxRequest } from '../../transactionMiddleware'
import { findEmployeeById } from '../models/employee/findEmployeeById'
import { setActive } from '../models/employee/setActive'

const activate = async (req: TxRequest, employee: Employee) => {
    await setActive(employee, true, null, req.transactionClient)
    req.flash('success', `${employee.firstName} ${employee.lastName} reactivated.`)
}

export const activateEmployeeController = async (req: TxRequest, res: Response) => {
    const id = Number(req.params.id)
    const employee = await findEmployeeById(id, req.transactionClient)
    if (employee) await activate(req, employee)
    res.redirect(`/employees/${id}`)
}
