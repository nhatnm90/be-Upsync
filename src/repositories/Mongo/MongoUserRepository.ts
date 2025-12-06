import { IUserRepository } from '../interface/IUserRepository'
import User, { IUserDocument } from '../../models/User'
import { IUser } from '../../dtos/userDTO'

export class MongoUserRepository implements IUserRepository {
  async create(payload: Partial<IUser>): Promise<IUser> {
    const user = new User(payload)
    const newUser = await user.save()
    return this.toEntity(newUser)
  }

  // async find(partialUser: Partial<IUser>): Promise<IUser | null> {
  //   if (!partialUser) return null
  //   const user = await User.findOne(partialUser).exec()
  //   return user ? this.toEntity(user) : null
  // }

  async findOne<K extends keyof IUser>(params: Pick<IUser, K>, hidePassword: boolean = false): Promise<IUser | null> {
    const mongoQuery: any = { ...params }

    if ('id' in params) {
      mongoQuery._id = params.id
      delete mongoQuery.id
    }

    const doc = await User.findOne(mongoQuery).exec()
    return doc ? this.toEntity(doc) : null
  }

  private toEntity(doc: IUserDocument, hidePassword = false): IUser {
    return {
      id: doc._id.toString(),
      username: doc.username,
      email: doc.email,
      firstName: doc.firstName,
      lastName: doc.lastName,
      avatarId: doc.avatarId,
      avatarUrl: doc.avatarUrl,
      bio: doc.bio,
      ...(!hidePassword && { hashedPassword: doc.hashedPassword })
    }
  }
}
