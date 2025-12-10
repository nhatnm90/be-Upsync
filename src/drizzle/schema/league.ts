import { pgTable, serial, varchar, timestamp, boolean, integer, uniqueIndex } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { leagueStatusEnum, leagueTypeEnum } from './const'

export const league = pgTable(
  'league',
  {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    year: integer('year').notNull(),
    type: leagueTypeEnum('type'),
    status: leagueStatusEnum('status'),
    oddKey: varchar('odd_key', { length: 255 }).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    startedAt: timestamp('started_at'),
    endAt: timestamp('end_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull()
  },
  (table) => [uniqueIndex('uq_league_name_year_oddkey').on(table.name, table.year, table.oddKey)]
)
const leagueSchema = createInsertSchema(league)
export type LeagueSchema = z.infer<typeof leagueSchema>
