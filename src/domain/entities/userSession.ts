export class UserSession {
  public id: string
  public userId: string
  public refreshToken: string
  public expiredAt: Date

  constructor(id: string, userId: string, refreshToken: string, expiredAt: Date) {
    this.id = id
    this.userId = userId
    this.refreshToken = refreshToken
    this.expiredAt = expiredAt
  }
}
