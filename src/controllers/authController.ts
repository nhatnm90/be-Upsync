import User from '../models/User'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import UserSession from '../models/UserSession'
import { Request, Response } from 'express'

const ACCESS_TOKEN_TTL = '30m'
const REFRESH_TOKEN_TTL = 1000 * 60 * 60 * 24 * 14
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'upsync'
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none', //backend và frontend chạy trên 2 domain khác nhau: none, giống nhau: strict
  path: '/'
}

const signUp = async (req: Request, res: Response) => {
  try {
    const { username, password, email, firstName, lastName } = req.body

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({ message: 'Missing information' })
    }

    const duplicate = await User.findOne({ $or: [{ username }, { email }] })
    if (duplicate) {
      res.status(409).json({ message: 'Username or email is existed' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await User.create({ username, hashedPassword, firstName, lastName, email })

    return res.status(204).json({ message: 'User created' })
  } catch (error) {
    console.log('Error when creating user: ', error)
    res.status(500).json({ message: 'Intenal server error: ', error })
  }
}

const signIn = async (req: Request, res: Response) => {
  try {
    // return res.status(401).json({ message: 'tèo rồi' })
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ message: 'Missing information' })
    }

    const exitedUser = await User.findOne({ username })
    if (!exitedUser || !exitedUser.hashedPassword) {
      return res.status(401).json({ message: 'Username or password incorrect' })
    }
    const matchedPassword = await bcrypt.compare(password, exitedUser.hashedPassword)
    if (!matchedPassword) {
      return res.status(401).json({ message: 'Username or password incorrect' })
    }

    const accessToken = jwt.sign({ userId: exitedUser._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_TTL
    })

    const refreshToken = crypto.randomBytes(64).toString('hex')
    await UserSession.create({
      userId: exitedUser._id,
      refreshToken,
      expriredAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
    })

    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_TTL, sameSite: 'none' })

    return res.status(200).json({ message: `User ${username} logged in succesfully`, accessToken })
  } catch (error) {
    console.log('Error when logging in user: ', error)
    res.status(500).json({ message: 'Intenal server error: ', error })
  }
}

const signInWithExternal = async (req: Request, res: Response) => {
  try {
    const { type, credentialResponse } = req.body
    if (!credentialResponse) {
      return res.status(400).json({ message: 'Missing information' })
    }
    const { email, given_name: firstName, family_name: lastName, name, picture: avatarUrl } = credentialResponse

    const username = name.trim().toLowerCase().split(' ').join('_')

    let exitedUser = await User.findOne({ email })
    if (!exitedUser) {
      // create new user
      exitedUser = await User.create({
        email,
        logInType: type,
        firstName,
        lastName: lastName || name || firstName,
        username: `${username}_${new Date().getMilliseconds()}`,
        avatarUrl
      })
    }

    const accessToken = jwt.sign({ userId: exitedUser._id }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_TTL
    })

    const refreshToken = crypto.randomBytes(64).toString('hex')
    await UserSession.create({
      userId: exitedUser._id,
      refreshToken,
      expriredAt: new Date(Date.now() + REFRESH_TOKEN_TTL)
    })

    res.cookie('refreshToken', refreshToken, { ...cookieOptions, maxAge: REFRESH_TOKEN_TTL, sameSite: 'none' })

    return res.status(200).json({ message: `User ${username} logged in succesfully`, accessToken })
  } catch (error) {
    console.log('Error when logging in user: ', error)
    res.status(500).json({ message: 'Intenal server error: ', error })
  }
}

const signOut = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken

    if (refreshToken) {
      await UserSession.deleteOne({ refreshToken })
    }
    res.clearCookie('refreshToken')
    return res.status(204).json({ message: 'Logged out successfully' })
  } catch (error) {
    console.log('Error when logging out user: ', error)
    res.status(500).json({ message: 'Intenal server error: ', error })
  }
}

const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken

    if (!refreshToken) {
      return res.status(401).json({ message: 'Token is not existed' })
    }

    const existedRefreshToken = await UserSession.findOne({ refreshToken })

    if (!existedRefreshToken) {
      return res.status(401).json({ message: 'Token is not existed or expired' })
    }

    if (existedRefreshToken.expriredAt < new Date()) {
      return res.status(403).json({ message: 'Token is expired' })
    }

    const accessToken = jwt.sign({ userId: existedRefreshToken.userId }, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_TTL
    })

    return res.status(200).json({ accessToken })
  } catch (error) {
    console.log('Error when create refresh token user: ', error)
    res.status(500).json({ message: 'Intenal server error: ', error })
  }
}

export { signUp, signIn, signOut, refreshToken, signInWithExternal }
