import 'dotenv/config'
import { app } from './app'
import { sequelize } from './db/sequelize'

const port = Number(process.env.PORT ?? 3000)

const start = async (): Promise<void> => {
    await sequelize.authenticate()
    app.listen(port, () => console.log(`Asset Management running on http://localhost:${port}`))
}

start().catch((error: unknown) => {
    console.error('Failed to start:', error)
    process.exit(1)
})
