import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { JwtUserPayload } from '../types/auth'
import { AuthRequest } from '../types/auth'
import { ForbiddenError, UnauthorizedError } from '../types/httpError'
import { userContainer } from '../container/userContainer'

export const protectRoute = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization']
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Kiểm tra cả prefix
      return next(new UnauthorizedError('Token is missing or improperly formatted'))
    }
    const accessToken = authHeader?.split(' ')[1] // get Bearer token

    if (!accessToken) {
      return next(new UnauthorizedError('Token is not existed'))
    }

    const secret = process.env.ACCESS_TOKEN_SECRET
    if (!secret) throw new Error('ACCESS_TOKEN_SECRET is not set in environment variables')

    const decodedUser = jwt.verify(accessToken, secret) as JwtUserPayload
    if (!decodedUser.userId) {
      return next(new ForbiddenError('Invalid token payload'))
    }
    const existedUser = await userContainer.userService.findOne({ id: decodedUser.userId }, true)
    if (!existedUser) {
      return next(new ForbiddenError('Invalid token payload'))
    }
    req.user = existedUser
    next()
  } catch (error) {
    next(error)
  }
}
