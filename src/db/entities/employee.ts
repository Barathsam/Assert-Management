import {
    DataTypes,
    Model,
    type CreationOptional,
    type InferAttributes,
    type InferCreationAttributes,
    type NonAttribute
} from 'sequelize'
import { sequelize } from '../sequelize'
import type { Branch } from './branch'
import type { ActiveAsset } from './activeAsset'

export class Employee extends Model<InferAttributes<Employee>, InferCreationAttributes<Employee>> {
    declare id: CreationOptional<number>
    declare employeeCode: string
    declare firstName: string
    declare lastName: string
    declare email: string | null
    declare phone: string | null
    declare designation: string | null
    declare department: string | null
    declare branchId: number
    declare dateOfJoining: string | null
    declare dateOfExit: string | null
    declare isActive: CreationOptional<boolean>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
    declare branch?: NonAttribute<Branch>
    declare heldAssets?: NonAttribute<ActiveAsset[]>
}

Employee.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        employeeCode: { type: DataTypes.STRING(32), allowNull: false, unique: true },
        firstName: { type: DataTypes.STRING(80), allowNull: false },
        lastName: { type: DataTypes.STRING(80), allowNull: false },
        email: { type: DataTypes.STRING(160), unique: true },
        phone: DataTypes.STRING(20),
        designation: DataTypes.STRING(80),
        department: DataTypes.STRING(80),
        branchId: { type: DataTypes.INTEGER, allowNull: false },
        dateOfJoining: DataTypes.DATEONLY,
        dateOfExit: DataTypes.DATEONLY,
        isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    { sequelize, tableName: 'employees', modelName: 'Employee' }
)
