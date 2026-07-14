import { DataTypes, Model, type CreationOptional, type InferAttributes, type InferCreationAttributes } from 'sequelize'
import { sequelize } from '../sequelize'

export class Branch extends Model<InferAttributes<Branch>, InferCreationAttributes<Branch>> {
    declare id: CreationOptional<number>
    declare code: string
    declare name: string
    declare city: string | null
    declare state: string | null
    declare isActive: CreationOptional<boolean>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

Branch.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        code: { type: DataTypes.STRING(8), allowNull: false, unique: true },
        name: { type: DataTypes.STRING(120), allowNull: false },
        city: DataTypes.STRING(80),
        state: DataTypes.STRING(80),
        isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    },
    { sequelize, tableName: 'branches', modelName: 'Branch' }
)
