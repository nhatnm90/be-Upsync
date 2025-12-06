// Định nghĩa lớp lỗi cơ bản
export class HttpError extends Error {
  public statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
    this.name = this.constructor.name // Gán tên lớp lỗi
    Error.captureStackTrace(this, this.constructor) // Tối ưu hóa stack trace
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string) {
    super(`[Error: Bad request] ${message}`, 400)
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized error') {
    super(`[Error: Unauthorized error] ${message}`, 401)
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = 'Forbidden error') {
    super(`[Error: Forbidden error] ${message}`, 403)
  }
}

export class NotFoundError extends HttpError {
  constructor(message = '') {
    super(`[Error: Resource not found] ${message}`, 404)
  }
}

export class ConflictError extends HttpError {
  constructor(message = 'Resouce is existed') {
    super(`[Error: Resouce is existed] ${message}`, 409)
  }
}

export class InternalServerError extends HttpError {
  constructor(message = 'Internal server error') {
    super(message, 500)
  }
}

export class NotImplementedError extends HttpError {
  constructor(message = 'The function has not implemented yet') {
    super(message, 501)
  }
}
