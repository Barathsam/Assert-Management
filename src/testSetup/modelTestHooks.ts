import { sequelize } from '../db/sequelize'
import { resetTestDb } from './resetTestDb'

afterEach(async () => {
    await resetTestDb(sequelize)
})

afterAll(async () => {
    await sequelize.close()
})
