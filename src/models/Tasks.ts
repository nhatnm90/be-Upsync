import mongoose, { Model, Document } from 'mongoose'

const LOG_TASK_STATUS = ['active', 'completed'] as const
export type TaskStatus = (typeof LOG_TASK_STATUS)[number]

export interface ITask {
  title: string
  status: TaskStatus
  completedAt: Date | null
  userId: mongoose.Types.ObjectId
}

export interface ITaskDocument extends ITask, Document {}

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: LOG_TASK_STATUS,
      default: 'active'
    },
    completedAt: {
      type: Date,
      default: null
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
)

const Task: Model<ITaskDocument> = mongoose.model<ITaskDocument>('Task', taskSchema)
export default Task
