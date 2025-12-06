import { MongoTaskRepository } from '../repositories/Mongo/MongoTaskRepository'
import { TaskService } from '../services/tasksService'

// Use the container to config the suitable repository
// Controller and Service does not need to update when change to other database
const mongoTaskRepo = new MongoTaskRepository()
//const postgresTaskRepo = new ...

const taskService = new TaskService(mongoTaskRepo)

export const taskContainer = { taskService }
