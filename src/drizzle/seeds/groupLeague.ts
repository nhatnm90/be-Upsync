import { DBPostgres } from '../index'
import { groupLeague } from '../schema'

export async function seedGroupLeague(dbPostgres: DBPostgres) {
  const [group, league] = await Promise.all([dbPostgres.query.group.findFirst(), dbPostgres.query.league.findFirst()])

  if (group && league) {
    await dbPostgres.insert(groupLeague).values({ groupId: group.id, leagueId: league.id })
  }
}
