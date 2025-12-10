import { pgTable, serial, timestamp, integer } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { league } from './league'
import { group } from './group'

export const groupLeague = pgTable('group_league', {
  id: serial('id').primaryKey(),
  leagueId: integer('league_id')
    .references(() => league.id)
    .notNull(),
  groupId: integer('group_id')
    .references(() => group.id)
    .notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
const groupLeagueSchema = createInsertSchema(groupLeague)
export type GroupLeagueSchema = z.infer<typeof groupLeagueSchema>
