export const TXN_TYPES = ['PURCHASE', 'ISSUE', 'RETURN', 'SEND_TO_REPAIR', 'REPAIR_COMPLETE', 'SCRAP'] as const

export type TxnType = (typeof TXN_TYPES)[number]
