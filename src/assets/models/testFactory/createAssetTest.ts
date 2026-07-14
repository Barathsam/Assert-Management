import { AssetCategory, Branch, Employee } from '../../../db/entities'
import { sequelize } from '../../../db/sequelize'
import { createAsset } from '../../service/createAsset'
import { seedAssetData } from '../../seed/asset'
import type { CreateAssetInput } from '../../types/assetInput'

export interface AssetRefs {
    branch: Branch
    category: AssetCategory
}

export const createBranchTest = (overrides: Partial<Branch> = {}) =>
    Branch.create({ code: 'BLR', name: 'Bangalore HQ', ...overrides })

export const createCategoryTest = (overrides: Partial<AssetCategory> = {}) =>
    AssetCategory.create({ code: 'LAP', name: 'Laptop', ...overrides })

export const createEmployeeTest = async (overrides: Partial<Employee> = {}) => {
    const branch = overrides.branchId ? null : await createBranchTest({ code: 'EMP' })
    return Employee.create({
        employeeCode: 'EMP0001',
        firstName: 'Priya',
        lastName: 'Sharma',
        branchId: branch ? branch.id : (overrides.branchId as number),
        ...overrides
    })
}

export const createRefs = async (): Promise<AssetRefs> => {
    const branch = await createBranchTest()
    const category = await createCategoryTest()
    return { branch, category }
}

export const createAssetIn = (refs: AssetRefs, overrides: Partial<CreateAssetInput> = {}) =>
    sequelize.transaction((tx) =>
        createAsset({ ...seedAssetData, categoryId: refs.category.id, branchId: refs.branch.id, ...overrides }, tx)
    )

export const createAssetTest = async (overrides: Partial<CreateAssetInput> = {}) => {
    const refs = await createRefs()
    const asset = await createAssetIn(refs, overrides)
    return { asset, ...refs }
}
