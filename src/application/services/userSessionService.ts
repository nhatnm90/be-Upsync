import { UserSession } from '../../domain/entities/userSession'
import { IUserSessionRepository } from '../interface/IUserSessionRepository'

export class UserSessionService {
  constructor(private userSessionRepo: IUserSessionRepository) {}

  async create(userSession: Partial<UserSession>) {
    await this.userSessionRepo.create(userSession)
  }

  async delete(userSession: Partial<UserSession>) {
    await this.userSessionRepo.delete(userSession)
  }
}
