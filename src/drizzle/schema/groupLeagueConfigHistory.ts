import { sql } from 'drizzle-orm'
import { pgTable, serial, timestamp, boolean, integer, uniqueIndex } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { groupLeague } from './groupLeague'

export const groupLeagueConfigHistory = pgTable(
  'group_league_config_history',
  {
    id: serial('id').primaryKey(),
    groupLeagueId: integer('group_league_id')
      .references(() => groupLeague.id)
      .notNull(),
    stakePerMatch: integer('stake_per_match').notNull(),
    isCurrent: boolean('is_current').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
  },
  (table) => [
    uniqueIndex('uniq_groupleague_current')
      .on(table.groupLeagueId)
      .where(sql`${table.isCurrent} = true`)
  ]
)
const groupLeagueConfigHistorySchema = createInsertSchema(groupLeagueConfigHistory)
export type GroupLeagueConfigHistorySchema = z.infer<typeof groupLeagueConfigHistorySchema>
