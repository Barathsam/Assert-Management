import { toDate } from './toDate'

const OPTIONS: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
}

export const formatDate = (value: string | Date | null | undefined): string => {
    const date = toDate(value)
    return date ? date.toLocaleDateString('en-GB', OPTIONS) : '—'
}
