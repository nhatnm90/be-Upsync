// Use the container to config the suitable repository
import { TaskService } from '../application/services/tasksService'
import { MongoTaskRepository } from '../insfrastructure/persistence/repositories/MongoTaskRepository'

// Controller and Service does not need to update when change to other database
const mongoTaskRepo = new MongoTaskRepository()
//const postgresTaskRepo = new ...

const taskService = new TaskService(mongoTaskRepo)

export const taskContainer = { taskService }
