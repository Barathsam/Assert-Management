export const orNull = <T>(value: T | null | undefined): T | null => value ?? null

export const blankToNull = (value: string | null | undefined): string | null => (value ? value : null)

export const orZero = (value: number | null | undefined): number => value ?? 0

export const moneyOrNull = (value: string | number | null | undefined): string | null =>
    value == null ? null : String(value)
