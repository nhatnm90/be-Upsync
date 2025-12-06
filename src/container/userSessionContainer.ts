import { MongoUserSessionRepository } from '../repositories/Mongo/MongoUserSessionRepository'
import { UserSessionService } from '../services/userSessionService'

// Use the container to config the suitable repository
// Controller and Service does not need to update when change to other database
const mongoUserRepo = new MongoUserSessionRepository()
//const postgresTaskRepo = new ...

const userSessionService = new UserSessionService(mongoUserRepo)

export const userSessionContainer = { userSessionService }
