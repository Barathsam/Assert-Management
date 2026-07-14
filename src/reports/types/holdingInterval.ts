export interface HoldingInterval {
    employeeId: number
    employeeName: string
    employeeCode: string
    issuedAt: Date
    returnedAt: Date | null
    returnReason: string | null
    days: number
}
