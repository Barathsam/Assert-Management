import { netCost } from './netCost'
import type { AssetTotalsRow } from '../types/assetTotalsRow'

const totals = (purchaseCost: number, repairCost: number, scrapValue: number): AssetTotalsRow => ({
    purchaseCost,
    repairCost,
    scrapValue,
    repairCount: 0,
    daysOwned: 0
})

describe('netCost', () => {
    test('is the purchase cost when nothing else happened', () => {
        expect(netCost(totals(82000, 0, 0))).toBe(82000)
    })

    test('adds repairs to the purchase cost', () => {
        expect(netCost(totals(82000, 4500, 0))).toBe(86500)
    })

    test('subtracts what scrapping recovered', () => {
        expect(netCost(totals(82000, 4500, 6000))).toBe(80500)
    })

    test('can go negative when we recovered more than we spent', () => {
        expect(netCost(totals(1000, 0, 1500))).toBe(-500)
    })

    test('adds numerically when the amounts arrive as the strings Sequelize gives for DECIMAL', () => {
        const stringy = {
            purchaseCost: '82000' as unknown as number,
            repairCost: '4500' as unknown as number,
            scrapValue: '0' as unknown as number,
            repairCount: 1,
            daysOwned: 100
        }

        expect(netCost(stringy)).toBe(86500)
    })
})
