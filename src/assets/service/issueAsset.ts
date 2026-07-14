import type { Transaction } from 'sequelize'
import { BusinessRuleError } from '../../common/errors/businessRuleError'
import { findEmployeeById } from '../../employees/models/employee/findEmployeeById'
import { applyTransition } from './applyTransition'

interface IssueInput {
    employeeId: number
    txnAt: Date
    remarks?: string | null
}

const assertIssuable = async (employeeId: number, tx: Transaction) => {
    const employee = await findEmployeeById(employeeId, tx)
    if (!employee) throw new BusinessRuleError('Employee not found.')
    if (!employee.isActive)
        throw new BusinessRuleError(
            `${employee.firstName} ${employee.lastName} is inactive and cannot be issued assets.`
        )
}

export const issueAsset = async (assetId: number, input: IssueInput, tx: Transaction) => {
    await assertIssuable(input.employeeId, tx)
    return applyTransition(
        {
            assetId,
            action: 'ISSUE',
            toStatus: 'ISSUED',
            ledger: { txnType: 'ISSUE', txnAt: input.txnAt, employeeId: input.employeeId, remarks: input.remarks },
            mutate: (asset) => {
                asset.currentHolderId = input.employeeId
            }
        },
        tx
    )
}
