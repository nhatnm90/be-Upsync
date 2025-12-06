import { ITaskRepository } from '../interface/ITaskRepository'
import Task, { ITask } from '../../models/Tasks'
import { NotFoundError } from '../../types/httpError'
import mongoose from 'mongoose'

export class MongoTaskRepository implements ITaskRepository {
  async getAllTasks(
    userId: string,
    filter: string
  ): Promise<{ tasks: ITask[]; activeTask: number; completedTask: number }> {
    const now = new Date()
    let startDate

    switch (filter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        const mondayDate = now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0)
        startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'all':
      default:
    }

    const _userId = new mongoose.Types.ObjectId(userId)
    const query = startDate ? { userId: _userId, createdAt: { $gte: startDate } } : { userId: _userId }

    const result = await Task.aggregate([
      {
        $match: query
      },
      {
        $facet: {
          tasks: [{ $sort: { createdAt: -1 } }],
          activeTask: [{ $match: { status: 'active' } }, { $count: 'count' }],
          completedTask: [{ $match: { status: 'completed' } }, { $count: 'count' }]
        }
      }
    ])
    const tasks = result[0].tasks as ITask[]
    const activeTask = result[0].activeTask[0]?.count || 0
    const completedTask = result[0].completedTask[0]?.count || 0
    return { tasks, activeTask, completedTask }
  }

  async create(payload: Partial<ITask>): Promise<ITask> {
    const task = new Task(payload)
    const newTask = await task.save()
    return newTask.toObject()
  }

  async update(taskId: string, payload: Partial<ITask>) {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        title: payload.title,
        status: payload.status,
        completedAt: payload.completedAt
      },
      { new: true }
    ).orFail(new Error(`The task Id ${taskId} is not found`))
    return updatedTask.toObject()
  }

  async delete(taskId: string) {
    const deletedTask = await Task.findByIdAndDelete({ _id: taskId }).orFail(
      new Error(`Delete taskId: ${taskId} has error`)
    )
    return deletedTask.toObject()
  }
}
