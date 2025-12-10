// drizzle.config.ts
import 'dotenv/config' // để tự load .env
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql', // dùng dialect mới, KHÔNG dùng driver: "pg" nữa
  schema: './src/drizzle/schema/index.ts', // đường dẫn tới file schema
  out: './src/drizzle/migration', // folder migrations
  dbCredentials: {
    url: process.env.POSTGRES_DB_CONNECTIONSTRING! // lấy từ .env
  }
})
