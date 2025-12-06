import { MongoUserRepository } from '../repositories/Mongo/MongoUserRepository'
import { UserService } from '../services/userService'

// Use the container to config the suitable repository
// Controller and Service does not need to update when change to other database
const mongoUserRepo = new MongoUserRepository()
//const postgresTaskRepo = new ...

const userService = new UserService(mongoUserRepo)

export const userContainer = { userService }
