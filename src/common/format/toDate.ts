const parse = (value: string | Date): Date => (value instanceof Date ? value : new Date(value))

const isValid = (date: Date | null): date is Date => date !== null && !Number.isNaN(date.getTime())

export const toDate = (value: string | Date | null | undefined): Date | null => {
    const date = value ? parse(value) : null
    return isValid(date) ? date : null
}
