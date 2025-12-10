import { DBPostgres } from '../index'
import { group } from '../schema'

export async function seedGroup(dbPostgres: DBPostgres) {
  const admin = await dbPostgres.query.user.findFirst({ where: (t, f) => f.eq(t.username, 'admin') })
  admin && (await dbPostgres.insert(group).values([{ name: 'The Bear Picklr', createdUserId: admin?.id }]))
}
