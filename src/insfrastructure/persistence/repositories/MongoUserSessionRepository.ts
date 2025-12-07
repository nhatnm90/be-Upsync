import { IUserSessionRepository } from '../../../application/interface/IUserSessionRepository'
import { UserSession } from '../../../domain/entities/userSession'
import UserSessionModel from '../../models/userSessionModel'

export class MongoUserSessionRepository implements IUserSessionRepository {
  async create(userSession: Partial<UserSession>): Promise<void> {
    await UserSessionModel.create({ ...userSession })
  }

  async delete(userSession: Partial<UserSession>): Promise<void> {
    await UserSessionModel.deleteOne({ ...userSession }).orFail(new Error('Error when delete userSession'))
  }
}
