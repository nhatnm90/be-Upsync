import { IUserRepository } from '../interface/IUserRepository'
import { IUserSessionRepository } from '../interface/IUserSessionRepository'
import UserSession, { IUserSession } from '../../models/UserSession'

export class MongoUserSessionRepository implements IUserSessionRepository {
  async create(userSession: IUserSession): Promise<void> {
    await UserSession.create({ ...userSession })
  }

  async delete(userSession: Partial<IUserSession>): Promise<void> {
    await UserSession.deleteOne({ ...userSession }).orFail(new Error('Error when delete userSession'))
  }
}
