import { sql, Table } from 'drizzle-orm'

import * as seeds from './seeds'
import { dbPostgres, DBPostgres } from '.'
import { groupLeague, groupMember, group, league, match, team, user } from './schema'

async function resetTable(dbPostgres: DBPostgres, table: Table) {
  return dbPostgres.execute(sql`truncate table ${table} restart identity cascade`)
}

async function main() {
  for (const table of [user, team, league, group, groupMember, groupLeague, match]) {
    await resetTable(dbPostgres, table)
  }
  await seeds.seedTeam(dbPostgres)
  await seeds.seedUser(dbPostgres)
  await seeds.seedGroup(dbPostgres)
  await seeds.seedLeague(dbPostgres)
  await seeds.seedGroupMember(dbPostgres)
  await seeds.seedGroupLeague(dbPostgres)
  await seeds.seedMatch(dbPostgres)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    console.log('Seeding done!')
    process.exit(0)
  })
