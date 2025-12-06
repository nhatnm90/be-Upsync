import { JwtPayload } from 'jsonwebtoken'
import { Request } from 'express'
import { IUser } from '../dtos/userDTO'

export interface JwtUserPayload extends JwtPayload {
  userId: string
}

export interface AuthRequest extends Request {
  user?: IUser
}
