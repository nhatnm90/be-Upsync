import Task, { ITask } from '../../models/Tasks'

export interface ITaskRepository {
  getAllTasks(userId: string, filter: string): Promise<{ tasks: ITask[]; activeTask: number; completedTask: number }>
  create(payload: Partial<ITask>): Promise<ITask>
  update(tasId: string, payload: Partial<ITask>): Promise<ITask>
  delete(taskId: string): Promise<ITask>
}
