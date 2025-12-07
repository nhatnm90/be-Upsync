import { User } from '../../domain/entities/user'
import { IUserRepository } from '../interface/IUserRepository'

export class UserService {
  constructor(private userRepo: IUserRepository) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = await this.userRepo.create(user)
    return newUser
  }

  async findOne<K extends keyof User>(params: Pick<User, K>, hidePassword: boolean = false): Promise<User | null> {
    const user = await this.userRepo.findOne(params, hidePassword)
    return user
  }
}
