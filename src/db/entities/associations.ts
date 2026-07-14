import { ActiveAsset } from './activeAsset'
import { Asset } from './asset'
import { AssetCategory } from './assetCategory'
import { AssetTransaction } from './assetTransaction'
import { Branch } from './branch'
import { Employee } from './employee'

const assetModels = [Asset, ActiveAsset]

const linkAssetRefs = () =>
    assetModels.forEach((M) => {
        M.belongsTo(AssetCategory, { foreignKey: 'categoryId', as: 'category' })
        M.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' })
        M.belongsTo(Employee, { foreignKey: 'currentHolderId', as: 'holder' })
    })

const linkEmployee = () => {
    Employee.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' })
    Branch.hasMany(Employee, { foreignKey: 'branchId', as: 'employees' })
    Employee.hasMany(ActiveAsset, { foreignKey: 'currentHolderId', as: 'heldAssets' })
}

const linkTransaction = () => {
    AssetTransaction.belongsTo(Asset, { foreignKey: 'assetId', as: 'asset' })
    AssetTransaction.belongsTo(Employee, { foreignKey: 'employeeId', as: 'employee' })
    AssetTransaction.belongsTo(Branch, { foreignKey: 'branchId', as: 'branch' })
    Asset.hasMany(AssetTransaction, { foreignKey: 'assetId', as: 'transactions' })
}

linkAssetRefs()
linkEmployee()
linkTransaction()
