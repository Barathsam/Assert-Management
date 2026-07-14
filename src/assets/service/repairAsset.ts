import type { Transaction } from 'sequelize'
import { applyTransition } from './applyTransition'

interface RepairInput {
    txnAt: Date
    vendor?: string | null
    remarks?: string | null
}

interface CompleteInput extends RepairInput {
    cost: string | number
}

const noMutation = () => undefined

export const sendToRepair = (assetId: number, input: RepairInput, tx: Transaction) =>
    applyTransition(
        {
            assetId,
            action: 'SEND_TO_REPAIR',
            toStatus: 'IN_REPAIR',
            ledger: { txnType: 'SEND_TO_REPAIR', ...input },
            mutate: noMutation
        },
        tx
    )

export const completeRepair = (assetId: number, input: CompleteInput, tx: Transaction) =>
    applyTransition(
        {
            assetId,
            action: 'REPAIR_COMPLETE',
            toStatus: 'IN_STOCK',
            ledger: {
                txnType: 'REPAIR_COMPLETE',
                txnAt: input.txnAt,
                amount: input.cost,
                vendor: input.vendor,
                remarks: input.remarks
            },
            mutate: noMutation
        },
        tx
    )
