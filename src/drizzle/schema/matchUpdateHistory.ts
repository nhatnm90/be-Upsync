import { pgTable, serial, timestamp, integer, decimal } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { match } from './match'
import { user } from './user'

export const matcheUpdateHistory = pgTable('match_update_history', {
  id: serial('id').primaryKey(),
  matchId: integer('match_id')
    .references(() => match.id)
    .notNull(),
  userId: integer('user_id')
    .references(() => user.id)
    .notNull(),
  handicapValue: decimal('handicap_value', { precision: 4, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

const matcheUpdateHistorySchema = createInsertSchema(matcheUpdateHistory)
export type MatcheUpdateHistorySchema = z.infer<typeof matcheUpdateHistorySchema>
