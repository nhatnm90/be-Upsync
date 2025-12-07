import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRoute from './insfrastructure/express/routes/authRoute'
import taskRoute from './insfrastructure/express/routes/tasksRoute'
import userRoute from './insfrastructure/express/routes/userRoute'
import { protectRoute } from './insfrastructure/persistence/middlewares/authMiddleware'
import { globalErrorMiddleware } from './insfrastructure/persistence/middlewares/globalErrorMiddleware'

const app = express()

app.use(express.json())
app.use(cookieParser())

if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: [process.env.CLIENT_URL_LOCAL || 'http://localhost:5173'], credentials: true }))
} else {
  const clientUrl = process.env.CLIENT_URL
  if (!clientUrl) console.error('Client url is missing in env variables')
  else app.use(cors({ origin: [clientUrl], credentials: true }))
}

// public routes
app.use('/api/auth', authRoute)
app.use('/api/tasks', protectRoute, taskRoute)

// private routes
// app.use(protectRoute)
app.use('/api/user', protectRoute, userRoute)

// middleware to handle all error before response
app.use(globalErrorMiddleware)

export default app
