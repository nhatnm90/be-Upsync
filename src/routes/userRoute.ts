import express from 'express'
import { authMe } from '../controllers/userController'

const router = express.Router()

router.get('/me', authMe)

router.get('/test', (req, res) => {
  return res.sendStatus(204) // .status(204) //.json({ message: 'ok' })
})

export default router
