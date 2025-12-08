import { NextFunction, Response } from 'express'
import { AuthRequest } from '../../types/auth'

const authMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user } = req

    return res.status(200).json({ user })
  } catch (error) {
    next(error)
  }
}

export { authMe }
