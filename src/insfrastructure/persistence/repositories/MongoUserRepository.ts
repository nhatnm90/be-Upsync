import { IUserRepository } from '../../../application/interface/IUserRepository'
import { User } from '../../../domain/entities/user'
import UserModel, { IUserModelDocument } from '../models/userModel'

export class MongoUserRepository implements IUserRepository {
  async create(payload: Partial<User>): Promise<User> {
    const user = new UserModel(payload)
    const newUser = await user.save()
    return this.toEntity(newUser)
  }

  async findOne<K extends keyof User>(params: Pick<User, K>, hidePassword: boolean = false): Promise<User | null> {
    const mongoQuery: any = { ...params }

    if ('id' in params) {
      mongoQuery._id = params.id
      delete mongoQuery.id
    }

    const doc = await UserModel.findOne(mongoQuery).exec()
    return doc ? this.toEntity(doc, hidePassword) : null
  }

  private toEntity(doc: IUserModelDocument, hidePassword = false): User {
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
