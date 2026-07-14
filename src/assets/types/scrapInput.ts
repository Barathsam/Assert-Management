import type { ReturnReason } from '../../common/types/returnReason'

export interface ScrapInput {
    txnAt: Date
    scrapValue: string | number
    reason: string
    returnReason?: ReturnReason
    remarks?: string | null
}
