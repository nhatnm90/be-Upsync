import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import UserSessionModel from '@/insfrastructure/persistence/models/userSessionModel'
import { NextFunction, Request, Response } from 'express'
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  InternalServerError,
  UnauthorizedError
} from '@/types/httpError'
import { userContainer } from '@/presentation/container/userContainer'
import { userSessionContainer } from '@/presentation/container/userSessionContainer'

const ACCESS_TOKEN_TTL = '30m'
const REFRESH_TOKEN_TTL = 1000 * 60 * 60 * 24 * 14
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ?? 'upsync'
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none', //backend và frontend chạy trên 2 domain khác nhau: none, giống nhau: strict
  path: '/'
}

const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password, email, firstName, lastName } = req.body

    if (!username || !password || !email || !firstName || !lastName) {
      return next(new BadRequestError('Missing information'))
    }

    const duplicate = await userContainer.userService.findOne({ username, email })
    if (duplicate) {
      return next(new ConflictError('Username or email is existed'))
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    await userContainer.userService.create({ username, hashedPassword, firstName, lastName, email })

    return res.status(204).json({ message: 'User created' })
  } catch (error) {
    next(error)
  }
}

const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return next(new BadRequestError('Missing information'))
    }

    const exitedUser = await userContainer.userService.findOne({ username })
    if (!exitedUser || !exitedUser.hashedPassword) {
      return next(new UnauthorizedError('Username or email is existed'))
    }
    const matchedPassword = await bcrypt.compare(password, exitedUser.hashedPassword)
    if (!matchedPassword) {
      return next(new UnauthorizedError('Username or email is existed'))
    }

    const accessToken = jwt.sign({ userId: exitedUser.id }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_TTL
    })

    const refreshToken = crypto.randomBytes(64).toString('hex')
    await userSessionContainer.userSessionService.create({
      userId: exitedUser.id.toString(),
      refreshToken,
      expiredAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
    })

    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_TTL, sameSite: 'none' })

    return res.status(200).json({ message: `User ${username} logged in succesfully`, accessToken })
  } catch (error) {
    next(error)
  }
}

const signInWithExternal = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, credentialResponse } = req.body
    if (!credentialResponse) {
      return next(new BadRequestError('Missing information'))
    }
    const { email, given_name: firstName, family_name: lastName, name, picture: avatarUrl } = credentialResponse

    const username = name.trim().toLowerCase().split(' ').join('_')

    let exitedUser = await userContainer.userService.findOne({ email })
    if (!exitedUser) {
      // create new user
      const hashedPassword = await bcrypt.hash(username, 10)
      exitedUser = await userContainer.userService.create({
        hashedPassword,
        email,
        logInType: type,
        firstName,
        lastName: lastName || name || firstName,
        username: `${username}_${new Date().getMilliseconds()}`,
        avatarUrl
      })
    }

    if (!exitedUser) {
      return next(new InternalServerError())
    }

    const accessToken = jwt.sign({ userId: exitedUser.id }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_TTL
    })

    const refreshToken = crypto.randomBytes(64).toString('hex')

    await userSessionContainer.userSessionService.create({
      userId: exitedUser.id,
      refreshToken,
      expiredAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
    })

    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_TTL, sameSite: 'none' })

    return res.status(200).json({ message: `User ${username} logged in succesfully`, accessToken })
  } catch (error) {
    next(error)
  }
}

const signOut = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken

    if (refreshToken) {
      await userSessionContainer.userSessionService.delete({ refreshToken })
    }
    res.clearCookie('refreshToken')
    return res.status(204).json({ message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
      return next(new BadRequestError('Token is not existed'))
    }

    const existedRefreshToken = await UserSessionModel.findOne({ refreshToken })

    if (!existedRefreshToken) {
      return next(new BadRequestError('Token is not existed'))
    }

    if (existedRefreshToken.expiredAt < new Date()) {
      return next(new ForbiddenError('Token is expired'))
    }

    const accessToken = jwt.sign({ userId: existedRefreshToken.userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_TTL
    })

    return res.status(200).json({ accessToken })
  } catch (error) {
    next(error)
  }
}

export { signUp, signIn, signOut, refreshToken, signInWithExternal }
