import dotenv from 'dotenv'
dotenv.config()
import app from './app'
import { db } from './config/db'

const PORT = process.env.PORT || 2101
const MONGODB_CONNECTIONSTRING = process.env.MONGODB_CONNECTIONSTRING as string

if (!MONGODB_CONNECTIONSTRING) {
  console.error('Missing MONGODB_CONNECTIONSTRING in env variables')
  process.exit(1)
}

async function bootstrap() {
  try {
    await db.connect(MONGODB_CONNECTIONSTRING)

    app.listen(PORT, () => {
      console.log(`✅ Upsync started on: ${PORT}`)
    })
  } catch (error) {
    console.error('❌ Upsync start error:', error)
    process.exit(1)
  }
}

bootstrap()

process.on('SIGINT', async () => {
  await db.disconnect()
  process.exit(0)
})
