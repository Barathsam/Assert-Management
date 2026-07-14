import type { Router } from 'express'
import { routerGet, routerPost } from '../../routerMethods'
import { createAssetController } from '../controller/asset/createAsset'
import { editAssetFormController } from '../controller/asset/editAssetForm'
import { listAssetsController } from '../controller/asset/listAssets'
import { newAssetFormController } from '../controller/asset/newAssetForm'
import { showAssetController } from '../controller/asset/showAsset'
import { updateAssetController } from '../controller/asset/updateAsset'
import { createAssetSchema, updateAssetSchema } from '../validation/assetSchemas'

export const registerAssetRoutes = (router: Router) => {
    routerGet(router, '/assets', listAssetsController)
    routerGet(router, '/assets/new', newAssetFormController)
    routerPost(router, '/assets', createAssetSchema, createAssetController)
    routerGet(router, '/assets/:id', showAssetController)
    routerGet(router, '/assets/:id/edit', editAssetFormController)
    routerPost(router, '/assets/:id', updateAssetSchema, updateAssetController)
}
