import type { Sequelize } from 'sequelize'
import { sequelize } from './sequelize'

export const db = (): Sequelize => sequelize
