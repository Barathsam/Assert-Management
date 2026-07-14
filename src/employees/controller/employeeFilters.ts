import { Op, type WhereOptions } from 'sequelize'
import type { EmployeeFilters } from '../types/employeeTypes'

const SEARCH_FIELDS = ['firstName', 'lastName', 'employeeCode', 'email', 'designation']

const STATUS_CLAUSE: Record<string, { isActive: boolean }> = {
    active: { isActive: true },
    inactive: { isActive: false }
}

const statusClause = (status: string) => STATUS_CLAUSE[status] ?? {}

const branchClause = (branchId?: number) => (branchId ? { branchId } : {})

const searchClause = (q: string) =>
    q ? { [Op.or]: SEARCH_FIELDS.map((field) => ({ [field]: { [Op.iLike]: `%${q}%` } })) } : {}

export const employeeFilters = (filters: EmployeeFilters): WhereOptions => ({
    ...statusClause(filters.status),
    ...branchClause(filters.branchId),
    ...searchClause(filters.q)
})
