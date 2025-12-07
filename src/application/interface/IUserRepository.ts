import { User } from '../../domain/entities/user'

export interface IUserRepository {
  create(payload: Partial<User>): Promise<User>
  findOne<K extends keyof User>(params: Pick<User, K>, hidePassword?: boolean): Promise<User | null>
}
