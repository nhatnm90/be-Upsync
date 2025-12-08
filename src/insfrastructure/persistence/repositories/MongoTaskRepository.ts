import mongoose from 'mongoose'
import TaskModel, { ITaskModelDocument } from '../models/taskModel'
import { ITaskRepository } from '../../../application/interface/ITaskRepository'
import { Task } from '../../../domain/entities/task'

export class MongoTaskRepository implements ITaskRepository {
  async getAllTasks(
    userId: string,
    filter: string
  ): Promise<{ tasks: Task[]; activeTask: number; completedTask: number }> {
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

    const result = await TaskModel.aggregate([
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
    const tasks = this.toListEntity(result[0].tasks)
    const activeTask = result[0].activeTask[0]?.count || 0
    const completedTask = result[0].completedTask[0]?.count || 0
    return { tasks, activeTask, completedTask }
  }

  async create(payload: Partial<Task>): Promise<Task> {
    const task = new TaskModel(payload)
    const newTask = await task.save()
    return this.toEntity(newTask)
  }

  async update(taskId: string, payload: Partial<Task>) {
    const updatedTask = await TaskModel.findByIdAndUpdate(
      taskId,
      {
        title: payload.title,
        status: payload.status,
        completedAt: payload.completedAt
      },
      { new: true }
    ).orFail(new Error(`The task Id ${taskId} is not found`))
    return this.toEntity(updatedTask)
  }

  async delete(taskId: string) {
    const deletedTask = await TaskModel.findByIdAndDelete({ _id: taskId }).orFail(
      new Error(`Delete taskId: ${taskId} has error`)
    )
    return this.toEntity(deletedTask)
  }

  private toEntity(doc: ITaskModelDocument): Task {
    return {
      id: doc._id.toString(),
      completedAt: doc.completedAt,
      title: doc.title,
      status: doc.status, // === 'active' ? TaskStatus.ACTIVE : TaskStatus.COMPLETED
      createdAt: doc.createdAt
    }
  }

  private toListEntity(listTask: ITaskModelDocument[]): Task[] {
    return listTask && listTask.length > 0 ? listTask.map((x) => this.toEntity(x)) : []
  }
}
