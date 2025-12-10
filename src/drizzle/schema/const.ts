import { pgEnum } from 'drizzle-orm/pg-core'

export const betSideEnum = pgEnum('bet_side', ['HOME', 'AWAY'])
export const leagueTypeEnum = pgEnum('league_type', ['LEAGUE', 'CUP', 'OTHER'])
export const leagueStatusEnum = pgEnum('league_status', ['PLANNING', 'READY', 'COMPLETED'])
