import { DBPostgres } from '../index'
import { match, MatchSchema } from '../schema'

export async function seedMatch(dbPostgres: DBPostgres) {
  const [league, teams] = await Promise.all([dbPostgres.query.league.findFirst(), dbPostgres.query.team.findMany()])

  if (league && teams) {
    const data: MatchSchema[] = []
    for (let i = 0; i < teams.length - 1; i += 2) {
      const homeTeam = teams[i]
      const awayTeam = teams[i + 1]
      if (!homeTeam?.id || !awayTeam?.id) continue
      data.push({
        leagueId: league.id,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        handicapValue: 1,
        startTime: new Date()
      })
    }
    data.length > 0 && (await dbPostgres.insert(match).values(data))
  }
}
