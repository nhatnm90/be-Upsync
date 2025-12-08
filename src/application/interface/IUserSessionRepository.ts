import { UserSession } from '../../domain/entities/userSession'

export interface IUserSessionRepository {
  create(userSesion: Partial<UserSession>): Promise<void>
  delete(userSesion: Partial<UserSession>): Promise<void>
}
