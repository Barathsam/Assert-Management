import { ActiveAsset, AssetTransaction } from '../../../db/entities'
import { sequelize } from '../../../db/sequelize'
import { issueAsset } from '../../service/issueAsset'
import { returnAsset } from '../../service/returnAsset'
import { scrapAsset } from '../../service/scrapAsset'
import { createAssetTest, createEmployeeTest } from '../testFactory/createAssetTest'
import { findLatestTransaction } from './findLatestTransaction'

const ledgerFor = (assetId: number) =>
    AssetTransaction.findAll({
        where: { assetId },
        order: [
            ['txnAt', 'ASC'],
            ['id', 'ASC']
        ]
    })

const at = (day: string) => new Date(`${day}T00:00:00Z`)

describe('Asset Transaction Ledger', () => {
    test('should record a PURCHASE row when the asset is created', async () => {
        const { asset } = await createAssetTest()
        const ledger = await ledgerFor(asset.id)
        expect(ledger).toHaveLength(1)
        expect(ledger[0]).toMatchObject({ txnType: 'PURCHASE', fromStatus: null, toStatus: 'IN_STOCK' })
        expect(ledger[0]?.amount).toBe('82000.00')
    })

    test('should keep the ledger contiguous across a full lifecycle', async () => {
        const { asset, branch } = await createAssetTest()
        const employee = await createEmployeeTest({ branchId: branch.id })
        await sequelize.transaction((tx) =>
            issueAsset(asset.id, { employeeId: employee.id, txnAt: at('2026-02-01') }, tx)
        )
        await sequelize.transaction((tx) => returnAsset(asset.id, { reason: 'REPAIR', txnAt: at('2026-03-01') }, tx))
        const ledger = await ledgerFor(asset.id)
        const chain = ledger.map((row) => [row.fromStatus, row.toStatus])
        expect(chain).toEqual([
            [null, 'IN_STOCK'],
            ['IN_STOCK', 'ISSUED'],
            ['ISSUED', 'IN_REPAIR']
        ])
    })

    test('should reject an UPDATE to the ledger — history cannot be rewritten', async () => {
        const { asset } = await createAssetTest()
        await expect(
            AssetTransaction.update({ amount: '1.00' }, { where: { assetId: asset.id } })
        ).rejects.toThrowError(/append-only/)
    })

    test('should reject a DELETE from the ledger', async () => {
        const { asset } = await createAssetTest()
        await expect(AssetTransaction.destroy({ where: { assetId: asset.id } })).rejects.toThrowError(/append-only/)
    })

    test('should return the most recent event for an asset', async () => {
        const { asset, branch } = await createAssetTest()
        const employee = await createEmployeeTest({ branchId: branch.id })
        await sequelize.transaction((tx) =>
            issueAsset(asset.id, { employeeId: employee.id, txnAt: at('2026-02-01') }, tx)
        )
        const latest = await findLatestTransaction(asset.id)
        expect(latest?.txnType).toBe('ISSUE')
    })
})

describe('Scrapped assets and requirement 7', () => {
    test('should hide a scrapped asset from the assets_active view but keep its ledger', async () => {
        const { asset } = await createAssetTest()
        await sequelize.transaction((tx) =>
            scrapAsset(asset.id, { txnAt: at('2026-04-01'), scrapValue: 3000, reason: 'Obsolete' }, tx)
        )
        expect(await ActiveAsset.findByPk(asset.id)).toBeNull()
        const ledger = await ledgerFor(asset.id)
        expect(ledger.map((r) => r.txnType)).toEqual(['PURCHASE', 'SCRAP'])
    })

    test('should return an issued asset and scrap it in one go, recording both events', async () => {
        const { asset, branch } = await createAssetTest()
        const employee = await createEmployeeTest({ branchId: branch.id })
        await sequelize.transaction((tx) =>
            issueAsset(asset.id, { employeeId: employee.id, txnAt: at('2026-02-01') }, tx)
        )
        await sequelize.transaction((tx) =>
            scrapAsset(
                asset.id,
                { txnAt: at('2026-05-01'), scrapValue: 0, reason: 'Lost', returnReason: 'RESIGNATION' },
                tx
            )
        )
        const ledger = await ledgerFor(asset.id)
        expect(ledger.map((r) => r.txnType)).toEqual(['PURCHASE', 'ISSUE', 'RETURN', 'SCRAP'])
        expect(await ActiveAsset.findByPk(asset.id)).toBeNull()
    })

    test('should refuse to scrap an issued asset when no return reason is given', async () => {
        const { asset, branch } = await createAssetTest()
        const employee = await createEmployeeTest({ branchId: branch.id })
        await sequelize.transaction((tx) =>
            issueAsset(asset.id, { employeeId: employee.id, txnAt: at('2026-02-01') }, tx)
        )
        await expect(
            sequelize.transaction((tx) =>
                scrapAsset(asset.id, { txnAt: at('2026-05-01'), scrapValue: 0, reason: 'Lost' }, tx)
            )
        ).rejects.toThrowError(/still issued/)
    })
})
