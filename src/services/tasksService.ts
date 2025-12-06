import { ITask } from '../models/Tasks'
import { ITaskRepository } from '../repositories/interface/ITaskRepository'

export class TaskService {
  constructor(private taskRepo: ITaskRepository) {}

  async getAllTasks(
    userId: string,
    filter: string
  ): Promise<{ tasks: ITask[]; activeTask: number; completedTask: number }> {
    const result = await this.taskRepo.getAllTasks(userId, filter)
    return result
  }

  async create(payload: Partial<ITask>) {
    const data: Partial<ITask> = { ...payload }
    await this.taskRepo.create(data)
  }

  async update(taskId: string, payload: Partial<ITask>) {
    await this.taskRepo.update(taskId, payload)
  }

  async delete(taskId: string) {
    await this.taskRepo.delete(taskId)
  }
}
