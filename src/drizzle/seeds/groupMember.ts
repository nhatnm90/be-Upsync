import { DBPostgres } from '../index'
import { groupMember, GroupMemberSchema } from '../schema'

export async function seedGroupMember(dbPostgres: DBPostgres) {
  const [group, members] = await Promise.all([dbPostgres.query.group.findFirst(), dbPostgres.query.user.findMany()])

  if (group && members) {
    const data: GroupMemberSchema[] = members.map((x, i) => {
      return { userId: x.id, groupId: group.id, isAdmin: i === 0 }
    })
    await dbPostgres.insert(groupMember).values(data)
  }
}
