import { DBPostgres } from '../index'
import { LeagueSchema, league } from '../schema'
const data: LeagueSchema[] = [
  {
    name: 'English Premier League',
    oddKey: 'soccer_epl',
    year: 2025,
    type: 'LEAGUE',
    status: 'READY'
  }
]

export async function seedLeague(dbPostgres: DBPostgres) {
  await dbPostgres.insert(league).values(data)
}
