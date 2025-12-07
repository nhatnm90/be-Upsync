import { NextFunction, Request, Response } from 'express'
import { HttpError } from '../../../types/httpError'

export const globalErrorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // 1. Khởi tạo giá trị mặc định cho lỗi 500
  let statusCode = 500
  let message = 'Internal Server Error'

  // 2. ✅ BẮT LỖI TÙY CHỈNH (CUSTOM ERRORS)
  // Kiểm tra xem lỗi có phải là một trong các HttpError Class mà bạn đã định nghĩa không.
  if (err instanceof HttpError) {
    statusCode = err.statusCode // Lấy statusCode đã được gán (400, 401, 404, etc.)
    message = err.message // Lấy message của lỗi

    // Ghi log chi tiết lỗi Client (4xx) nếu cần, nhưng không phải stack trace.
    console.warn(`[HTTP Error ${statusCode}] ${err.name}: ${message}`)
  }
  // 3. BẮT CÁC LỖI HỆ THỐNG KHÁC (Mongoose, JWT, v.v.)
  else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401 // Lỗi xác thực token
    message = 'Authentication token is invalid or expired.'
  } else {
    // Đây là lỗi 500 thực sự (lỗi code, lỗi kết nối DB, v.v.)
    // Luôn ghi log chi tiết lỗi 500 để debug
    console.error('Unhandled Server Error:', err.stack || err)
  }

  // 4. Trả về phản hồi JSON chuẩn hóa
  return res.status(statusCode).json({
    status: 'error',
    name: err.name || 'Error', // Sử dụng tên lỗi gốc
    message: message
    // Chỉ gửi stack trace nếu ở môi trường phát triển (development)
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  })
}
