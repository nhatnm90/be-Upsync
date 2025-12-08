import { ITaskRepository } from '@/application/interface/ITaskRepository'
import { Task } from '@/domain/entities/task'

export class TaskService {
  constructor(private taskRepo: ITaskRepository) {}

  async getAllTasks(
    userId: string,
    filter: string
  ): Promise<{ tasks: Task[]; activeTask: number; completedTask: number }> {
    const result = await this.taskRepo.getAllTasks(userId, filter)
    return result
  }

  async create(payload: Partial<Task>) {
    const data: Partial<Task> = { ...payload }
    await this.taskRepo.create(data)
  }

  async update(taskId: string, payload: Partial<Task>) {
    await this.taskRepo.update(taskId, payload)
  }

  async delete(taskId: string) {
    await this.taskRepo.delete(taskId)
  }
}
