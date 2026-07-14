export interface EmployeeFields {
    employeeCode: string
    firstName: string
    lastName: string
    email: string | null
    phone: string | null
    designation: string | null
    department: string | null
    branchId: number
    dateOfJoining: string | null
}

export interface EmployeeFilters {
    status: string
    branchId?: number
    q: string
}

export interface EmployeeQuery {
    status?: string
    branchId?: string
    q?: string
}
