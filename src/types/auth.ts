import { JwtPayload } from 'jsonwebtoken'
import { IUser } from '../models/User'
import { Request } from 'express'

export interface JwtUserPayload extends JwtPayload {
  userId: string
}

export interface AuthRequest extends Request {
  user?: IUser
}
