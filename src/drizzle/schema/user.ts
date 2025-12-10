import { pgTable, serial, varchar, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const user = pgTable('user', {
  id: serial('id').primaryKey(),
  mongoUserId: varchar('mongo_user_id', { length: 50 }).notNull().unique(),
  username: varchar('username', { length: 100 }),
  email: varchar('email', { length: 255 }),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow()
})

const userSchema = createInsertSchema(user)
export type UserSchema = z.infer<typeof userSchema>
