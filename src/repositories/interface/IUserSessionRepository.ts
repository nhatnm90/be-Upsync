import { IUserSession } from '../../models/UserSession'

export interface IUserSessionRepository {
  create(userSesion: IUserSession): Promise<void>
  delete(userSesion: Partial<IUserSession>): Promise<void>
}
