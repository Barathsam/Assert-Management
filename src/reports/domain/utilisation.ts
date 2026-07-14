import type { HoldingInterval } from '../types/holdingInterval'
import type { Utilisation } from '../types/utilisation'

const sumDays = (holdings: HoldingInterval[]): number =>
    holdings.reduce((total, holding) => total + Number(holding.days), 0)

const pct = (daysIssued: number, daysOwned: number): number =>
    daysOwned > 0 ? Math.round((daysIssued / daysOwned) * 100) : 0

export const utilisation = (holdings: HoldingInterval[], daysOwned: number): Utilisation => {
    const daysIssued = sumDays(holdings)
    return { daysIssued, utilisationPct: pct(daysIssued, Number(daysOwned)) }
}
