const RUPEES = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
})

const isBlank = (value: string | number | null | undefined): boolean =>
    value === null || value === undefined || value === ''

export const formatCurrency = (value: string | number | null | undefined): string => {
    const amount = isBlank(value) ? NaN : Number(value)
    return Number.isFinite(amount) ? RUPEES.format(amount) : '—'
}
