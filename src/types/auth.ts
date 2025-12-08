import { JwtPayload } from 'jsonwebtoken'
import { Request } from 'express'
import { User } from '@/domain/entities/user'

export interface JwtUserPayload extends JwtPayload {
  userId: string
}

export interface AuthRequest extends Request {
  user?: Partial<User>
}
