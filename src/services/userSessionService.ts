import { IUserSession } from '../models/UserSession'
import { IUserSessionRepository } from '../repositories/interface/IUserSessionRepository'

export class UserSessionService {
  constructor(private userSessionRepo: IUserSessionRepository) {}

  async create(userSession: IUserSession) {
    await this.userSessionRepo.create(userSession)
  }

  async delete(userSession: Partial<IUserSession>) {
    await this.userSessionRepo.delete(userSession)
  }
}
