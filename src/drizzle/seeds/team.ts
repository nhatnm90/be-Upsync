import { DBPostgres } from '../index'
import { team, TeamSchema } from '../schema/team'
const teamData: TeamSchema[] = [
  {
    name: 'Arsenal',
    abbreviation: 'ARS',
    nation: 'England'
  },
  {
    name: 'Aston Villa',
    abbreviation: 'ASV',
    nation: 'England'
  },
  {
    name: 'Chelsea',
    abbreviation: 'CHE',
    nation: 'England'
  },
  {
    name: 'Liverpool',
    abbreviation: 'LIV',
    nation: 'England'
  },
  {
    name: 'Manchester United',
    abbreviation: 'MANU',
    nation: 'England'
  },
  {
    name: 'Manchester City',
    abbreviation: 'MANC',
    nation: 'England'
  },
  {
    name: 'Tottenham Hotspur',
    abbreviation: 'TOT',
    nation: 'England'
  },
  {
    name: 'Sunderland',
    abbreviation: 'SUN',
    nation: 'England'
  }
]

export async function seedTeam(dbPostgres: DBPostgres) {
  await dbPostgres.insert(team).values(teamData)
}
