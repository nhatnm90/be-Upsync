import { IUser } from '../dtos/userDTO'
import { IUserDocument } from '../models/User'
import { IUserRepository } from '../repositories/interface/IUserRepository'

export class UserService {
  constructor(private userRepo: IUserRepository) {}

  async create(user: Partial<IUser>): Promise<IUser> {
    const newUser = await this.userRepo.create(user)
    return newUser
  }

  async findOne<K extends keyof IUser>(params: Pick<IUser, K>, hidePassword: boolean = false): Promise<IUser | null> {
    const user = await this.userRepo.findOne(params, hidePassword)
    return user
  }
}
