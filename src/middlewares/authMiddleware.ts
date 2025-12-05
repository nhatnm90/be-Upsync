import { IUser } from './../models/User'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import { NextFunction, Request, Response } from 'express'
import { JwtUserPayload } from '../types/auth'
import { AuthRequest } from '../types/auth'

export const protectRoute = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization']

    const accessToken = authHeader?.split(' ')[1] // get Bearer token

    if (!accessToken) {
      return res.status(401).json({ message: 'Token is not existed' })
    }

    const secret = process.env.ACCESS_TOKEN_SECRET || 'upsync'

    const decodedUser = jwt.verify(accessToken, secret) as JwtUserPayload
    if (!decodedUser.userId) {
      return res.status(403).json({ message: 'Invalid token payload' })
    }
    const existedUser = await User.findById(decodedUser.userId).select('-hashedPassword').lean<IUser>()
    if (!existedUser) {
      return res.status(403).json({ message: 'Invalid token payload' })
    }
    req.user = existedUser
    next()
  } catch (error) {
    console.log('Error when authorizing user in Middleware: ', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
