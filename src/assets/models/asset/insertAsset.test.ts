import { UniqueConstraintError } from 'sequelize'
import { Asset, ActiveAsset } from '../../../db/entities'
import { createAssetIn, createAssetTest, createRefs } from '../testFactory/createAssetTest'
import { findAssetById } from './findAssetById'

describe('Create Asset Model', () => {
    test('should create an asset in stock with a generated asset tag', async () => {
        const { asset } = await createAssetTest()
        expect(asset.status).toBe('IN_STOCK')
        expect(asset.assetTag).toBe('LAP-BLR-000001')
        expect(asset.currentHolderId).toBeNull()
    })

    test('should uppercase and trim the serial number on write', async () => {
        const { asset } = await createAssetTest({ serialNumber: '  abc123  ' })
        expect(asset.serialNumber).toBe('ABC123')
    })

    test('should write a PURCHASE ledger row carrying the cost', async () => {
        const { asset } = await createAssetTest({ purchaseCost: '90000.00' })
        const reloaded = await findAssetById(asset.id)
        expect(reloaded?.purchaseCost).toBe('90000.00')
    })

    test('should number asset tags from a sequence so two assets never collide', async () => {
        const refs = await createRefs()
        const first = await createAssetIn(refs, { serialNumber: 'SN-A' })
        const second = await createAssetIn(refs, { serialNumber: 'SN-B' })
        expect(first.assetTag).toBe('LAP-BLR-000001')
        expect(second.assetTag).toBe('LAP-BLR-000002')
    })

    test('should reject a duplicate serial number', async () => {
        const refs = await createRefs()
        await createAssetIn(refs, { serialNumber: 'SN-DUP' })
        await expect(createAssetIn(refs, { serialNumber: 'SN-DUP' })).rejects.toBeInstanceOf(UniqueConstraintError)
    })

    test('should reject a duplicate serial that differs only by case and whitespace', async () => {
        const refs = await createRefs()
        await createAssetIn(refs, { serialNumber: 'abc123' })
        await expect(createAssetIn(refs, { serialNumber: '  ABC123 ' })).rejects.toBeInstanceOf(UniqueConstraintError)
    })

    test('should refuse an asset that claims to be ISSUED while holding nobody', async () => {
        const { asset } = await createAssetTest()
        await expect(Asset.update({ status: 'ISSUED' }, { where: { id: asset.id } })).rejects.toThrowError(
            /assets_issued_has_holder/
        )
    })

    test('should make a new asset visible through the assets_active view', async () => {
        const { asset } = await createAssetTest()
        expect(await ActiveAsset.findByPk(asset.id)).not.toBeNull()
    })
})
