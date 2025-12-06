import { IUser } from '../../dtos/userDTO'

export interface IUserRepository {
  create(payload: Partial<IUser>): Promise<IUser>
  // find(patialUser: Partial<IUser>): Promise<IUser | null>
  findOne<K extends keyof IUser>(params: Pick<IUser, K>, hidePassword?: boolean): Promise<IUser | null>
}
