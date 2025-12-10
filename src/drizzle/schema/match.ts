import { relations } from 'drizzle-orm'
import { pgTable, serial, varchar, timestamp, integer, doublePrecision } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { league } from './league'
import { team } from './team'
import { leagueStatusEnum, leagueTypeEnum } from './const'

export const match = pgTable('match', {
  id: serial('id').primaryKey(),
  leagueId: integer('league_id')
    .references(() => league.id)
    .notNull(),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  homeTeamId: integer('home_team_id')
    .references(() => team.id)
    .notNull(),
  awayTeamId: integer('away_team_id')
    .references(() => team.id)
    .notNull(),
  status: leagueStatusEnum('status'),
  oddEventId: varchar('odd_event_id', { length: 100 }).unique(),
  type: leagueTypeEnum('type'),
  handicapValue: doublePrecision('handicap_value').notNull(),
  homeScore: integer('home_score').notNull().default(0),
  awayScore: integer('away_score').notNull().default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
const matchSchema = createInsertSchema(match)
export type MatchSchema = z.infer<typeof matchSchema>

// Relation
export const matchTeamRelations = relations(match, ({ one }) => ({
  homeTeam: one(team, {
    fields: [match.homeTeamId],
    references: [team.id]
  }),
  awayTeam: one(team, {
    fields: [match.awayTeamId],
    references: [team.id]
  })
}))
