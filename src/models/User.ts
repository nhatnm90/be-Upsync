import mongoose, { Document, Model } from 'mongoose'

const LOG_IN_TYPE = ['EMAIL', 'GOOGLE', 'FACEBOOK', 'ICLOUD', 'OTHERS']

export interface IUserDocument extends Document {
  username: string
  hashedPassword: string // required đúng với schema
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string
  avatarId?: string
  bio?: string
  phone?: string
  logInType?: 'EMAIL' | 'GOOGLE' | 'FACEBOOK' | 'ICLOUD' | 'OTHERS'
  createdAt: Date
  updatedAt: Date
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    hashedPassword: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    avatarUrl: {
      type: String
    },
    avatarId: {
      type: String
    },
    bio: {
      type: String,
      maxlength: 500
    },
    phone: {
      type: String,
      sparse: true
    },
    logInType: {
      type: String,
      enum: LOG_IN_TYPE
    }
  },
  {
    timestamps: true
  }
)

const User: Model<IUserDocument> = mongoose.model<IUserDocument>('User', userSchema)
export default User
