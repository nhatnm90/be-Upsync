export class User {
  public id: string
  public username: string
  public hashedPassword?: string | undefined
  public email: string
  public firstName: string
  public lastName: string
  public avatarUrl?: string | undefined
  public avatarId?: string | undefined
  public bio?: string | undefined
  public phone?: string | undefined
  public logInType?: 'EMAIL' | 'GOOGLE' | 'FACEBOOK' | 'ICLOUD' | 'OTHERS'

  constructor(id: string, username: string, email: string, firstName: string, lastName: string) {
    this.id = id
    this.username = username
    this.email = email
    this.firstName = firstName
    this.lastName = lastName
  }
}
