// Use the container to config the suitable repository

import { UserSessionService } from '../../application/services/userSessionService'
import { MongoUserSessionRepository } from '../../insfrastructure/persistence/repositories/MongoUserSessionRepository'

// Controller and Service does not need to update when change to other database
const mongoUserRepo = new MongoUserSessionRepository()
//const postgresTaskRepo = new ...

const userSessionService = new UserSessionService(mongoUserRepo)

export const userSessionContainer = { userSessionService }
