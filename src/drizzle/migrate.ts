import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'
import * as schema from './schema'
import path from 'path'

if (!process.env.POSTGRES_DB_CONNECTIONSTRING) {
  throw new Error('POSTGRES_DB_CONNECTIONSTRING is not set')
}

const pool = new Pool({
  connectionString: process.env.POSTGRES_DB_CONNECTIONSTRING
})

export const dbPostgres = drizzle(pool, { schema })

async function main() {
  await migrate(dbPostgres, { migrationsFolder: path.join(__dirname, 'migration') })
  console.log('Migration done!')
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await pool.end()
  })
