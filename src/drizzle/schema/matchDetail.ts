import { pgTable, timestamp, integer, text, jsonb } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'

export const matchDetail = pgTable('match_detail', {
  matchId: integer('match_id').primaryKey().notNull(), // FK tới match.id
  stadium: text('stadium'),
  referee: text('referee'),
  homeScorers: jsonb('home_scorers').$type<{ playerName: string; time: number; type: 'Scored' | 'OG' }[]>(),
  awayScorers: jsonb('away_scorers').$type<{ playerName: string; time: number; type: 'Scored' | 'OG' }[]>(),
  yellowCards: jsonb('yellow_cards').$type<{ playerName: string; time: number; card: 'Yellow' | 'SecondYellow' }[]>(),
  redCards: jsonb('red_cards').$type<{ playerName: string; time: number; card: 'Red' }[]>(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow()
})

const matchDetailSchema = createInsertSchema(matchDetail)
export type MatchDetailSchema = z.infer<typeof matchDetailSchema>
