import type { Response } from 'express'
import { findBranches } from '../../masters/models/branch/findBranches'
import type { TxRequest } from '../../transactionMiddleware'
import { findEmployees } from '../models/employee/findEmployees'
import type { EmployeeFilters, EmployeeQuery } from '../types/employeeTypes'
import { employeeFilters } from './employeeFilters'

const asId = (value?: string): number | undefined => {
    const id = Number(value)
    return Number.isInteger(id) && id > 0 ? id : undefined
}

const filtersOf = (query: EmployeeQuery): EmployeeFilters => ({
    status: query.status ?? 'active',
    branchId: asId(query.branchId),
    q: (query.q ?? '').trim()
})

export const listEmployees = async (req: TxRequest, res: Response) => {
    const filters = filtersOf(req.query as EmployeeQuery)
    const [employees, branches] = await Promise.all([
        findEmployees(employeeFilters(filters), req.transactionClient),
        findBranches(req.transactionClient)
    ])
    res.render('employees/index', { title: 'Employees', employees, branches, filters })
}
