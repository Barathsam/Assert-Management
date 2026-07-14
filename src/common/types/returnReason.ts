export const RETURN_REASONS = [
    'UPGRADE',
    'REPAIR',
    'DAMAGED',
    'RESIGNATION',
    'PROJECT_END',
    'NOT_REQUIRED',
    'OTHER'
] as const

export type ReturnReason = (typeof RETURN_REASONS)[number]
