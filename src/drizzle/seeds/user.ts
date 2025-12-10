import { DBPostgres } from '../index'
import { user } from '../schema'

const data = [
  { mongoUserId: 'Admin', username: 'admin', email: 'admin@upsync.com' },
  { mongoUserId: 'mongoUserId_1', username: 'NN90', email: 'nhat.nguyen@upsync.com' },
  { mongoUserId: 'mongoUserId_2', username: 'MrAn Tran', email: 'an.tran@upsync.com' },
  { mongoUserId: 'mongoUserId_3', username: 'Pen Kai', email: 'nhut.le@upsync.com' },
  { mongoUserId: 'mongoUserId_4', username: 'Ryan Luu', email: 'phi.luu@upsync.com' },
  { mongoUserId: 'mongoUserId_5', username: 'Elvy', email: 'thanh.tran@upsync.com' }
]

export async function seedUser(dbPostgres: DBPostgres) {
  await dbPostgres.insert(user).values(data)
}
