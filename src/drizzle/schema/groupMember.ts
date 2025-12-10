import { pgTable, serial, timestamp, boolean, integer } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { user } from './user'
import { group } from './group'

export const groupMember = pgTable('group_member', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => user.id),
  groupId: integer('group_id')
    .notNull()
    .references(() => group.id),
  isAdmin: boolean('is_admin').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
const groupMemberSchema = createInsertSchema(groupMember)
export type GroupMemberSchema = z.infer<typeof groupMemberSchema>
