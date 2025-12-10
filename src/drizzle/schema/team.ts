import { relations } from 'drizzle-orm'
import { pgTable, serial, varchar, timestamp, text } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'
import { z } from 'zod'
import { match } from './match'

export const team = pgTable('team', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  abbreviation: varchar('abbreviation', { length: 50 }).notNull().unique(),
  nation: varchar('nation', { length: 255 }).notNull(),
  avartarUrl: varchar('avatar_url', { length: 255 }),
  avartarId: varchar('avatar_id', { length: 255 }),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})
const teamSchema = createInsertSchema(team)
export type TeamSchema = z.infer<typeof teamSchema>

export const teamMatchRelations = relations(team, ({ many }) => ({
  matches: many(match)
}))
