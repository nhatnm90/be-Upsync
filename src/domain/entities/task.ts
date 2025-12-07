import { TaskStatus } from '../../libs/constant'

export class Task {
  public id: string
  public title: string
  public status: string
  public completedAt: Date | null
  public createdAt: Date | null | undefined

  constructor(id: string, title: string, status: string) {
    this.id = id
    this.title = title
    this.status = status
    this.completedAt = null
  }

  // ✅ Logic nghiệp vụ được gắn vào Entity (Rich Domain Model)
  // public completeTask(): void {
  //   if (this.status === TaskStatus.COMPLETED) {
  //     throw new Error('Task is already completed.')
  //   }
  //   this.status = TaskStatus.COMPLETED
  //   this.completedAt = new Date()
  // }

  // public isValidTitle(): boolean {
  //   return this.title.length > 5
  // }
}
