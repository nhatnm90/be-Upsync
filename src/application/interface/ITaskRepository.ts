import { Task } from '@/domain/entities/task'

export interface ITaskRepository {
  getAllTasks(userId: string, filter: string): Promise<{ tasks: Task[]; activeTask: number; completedTask: number }>
  create(payload: Partial<Task>): Promise<Task>
  update(tasId: string, payload: Partial<Task>): Promise<Task>
  delete(taskId: string): Promise<Task>
}
