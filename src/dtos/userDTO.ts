export interface IUser {
  id: string
  username: string
  hashedPassword?: string | undefined
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string | undefined
  avatarId?: string | undefined
  bio?: string | undefined
  phone?: string | undefined
  logInType?: 'EMAIL' | 'GOOGLE' | 'FACEBOOK' | 'ICLOUD' | 'OTHERS'
}
