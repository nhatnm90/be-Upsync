import { pgTable, serial, timestamp, boolean, integer, index } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { group } from './group'
import { user } from './user'
import { groupLeague } from './groupLeague'
import { userMatchBet } from './userMatchBet'

export const groupFundTransaction = pgTable(
  'group_fund_transaction',
  {
    id: serial('id').primaryKey(),
    userMatchBetId: integer('user_match_bet_id')
      .references(() => userMatchBet.id)
      .notNull()
      .unique(),
    groupLeagueId: integer('group_league_id')
      .references(() => groupLeague.id)
      .notNull(),
    userId: integer('user_id')
      .references(() => user.id)
      .notNull(),
    groupId: integer('group_id')
      .references(() => group.id)
      .notNull(),
    stakePerMatch: integer('stake_per_match').notNull(),
    isPaid: boolean('is_paid').notNull().default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
  },
  (table) => [index('idx_gft_user_group').on(table.userId, table.groupLeagueId)]
)

const groupFundTransactionSchema = createInsertSchema(groupFundTransaction)
export type GroupFundTransactionSchema = z.infer<typeof groupFundTransactionSchema>
