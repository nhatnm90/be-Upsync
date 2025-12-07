// Use the container to config the suitable repository
import { UserService } from '../application/services/userService'
import { MongoUserRepository } from '../insfrastructure/persistence/repositories/MongoUserRepository'

// Controller and Service does not need to update when change to other database
const mongoUserRepo = new MongoUserRepository()
//const postgresTaskRepo = new ...

const userService = new UserService(mongoUserRepo)

export const userContainer = { userService }
