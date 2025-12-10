import { pgTable, serial, varchar, timestamp, boolean, integer, pgEnum, text } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { user } from './user'

export const group = pgTable('group', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  isActive: boolean('is_active').default(true).notNull(),
  createdUserId: integer('created_user_id')
    .notNull()
    .references(() => user.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
const groupSchema = createInsertSchema(group)
export type GroupSchema = z.infer<typeof groupSchema>
