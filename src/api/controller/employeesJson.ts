import type { Response } from 'express'
import { asId } from '../../assets/controller/asset/assetFilters'
import { employeeFilters } from '../../employees/controller/employeeFilters'
import { findEmployees } from '../../employees/models/employee/findEmployees'
import type { EmployeeQuery } from '../../employees/types/employeeTypes'
import type { TxRequest } from '../../transactionMiddleware'

const filtersOf = (query: EmployeeQuery) => ({
    status: query.status ?? 'active',
    branchId: asId(query.branchId),
    q: (query.q ?? '').trim()
})

export const employeesJsonController = async (req: TxRequest, res: Response) => {
    const employees = await findEmployees(employeeFilters(filtersOf(req.query as EmployeeQuery)))
    res.json({ data: employees })
}
