import { sql, Table } from 'drizzle-orm'

import { dbPostgres, DBPostgres } from '.'

async function resetTable(dbPostgres: DBPostgres, table: Table) {
  return dbPostgres.execute(sql`truncate table ${table} restart identity cascade`)
}

async function main() {
  const res = await dbPostgres.query.match.findMany({
    with: { homeTeam: { columns: { name: true, abbreviation: true } }, awayTeam: true }
  })
  console.log(res)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
