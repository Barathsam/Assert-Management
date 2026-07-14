import { toDate } from './toDate'

export const today = (): string => new Date().toISOString().slice(0, 10)

export const dayToDate = (day: string): Date | null => toDate(`${day.slice(0, 10)}T00:00:00Z`)

export const parseFormDate = (value: string | undefined, fallback: Date): Date =>
    (value ? dayToDate(value) : null) ?? fallback
