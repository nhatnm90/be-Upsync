import mongoose, { Model, Document } from 'mongoose'

export interface ITaskModelDocument extends Document {
  title: string
  status: 'active' | 'completed'
  completedAt: Date
  userId: string
  createdAt: Date
}

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
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

const TaskModel: Model<ITaskModelDocument> = mongoose.model<ITaskModelDocument>('TaskModel', taskSchema)
export default TaskModel
