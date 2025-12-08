import { IUserSessionRepository } from '@/application/interface/IUserSessionRepository'
import { UserSession } from '@/domain/entities/userSession'

export class UserSessionService {
  constructor(private userSessionRepo: IUserSessionRepository) {}

  async create(userSession: Partial<UserSession>) {
    await this.userSessionRepo.create(userSession)
  }

  async delete(userSession: Partial<UserSession>) {
    await this.userSessionRepo.delete(userSession)
  }
}
