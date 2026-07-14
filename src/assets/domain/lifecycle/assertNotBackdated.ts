import { BusinessRuleError } from '../../../common/errors/businessRuleError'

const asDay = (date: Date) => date.toISOString().slice(0, 10)

export const assertNotBackdated = (txnAt: Date, latestAt: Date | null): void => {
    if (latestAt && txnAt < latestAt)
        throw new BusinessRuleError(`Date cannot be earlier than the asset's last event (${asDay(latestAt)}).`)
}
