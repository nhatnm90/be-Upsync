import 'dotenv/config'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

if (!process.env.POSTGRES_DB_CONNECTIONSTRING) {
  throw new Error('POSTGRES_DB_CONNECTIONSTRING is not set')
}

const pool = new Pool({
  connectionString: process.env.POSTGRES_DB_CONNECTIONSTRING
})

export const dbPostgres = drizzle(pool, { schema })
export type DBPostgres = typeof dbPostgres
