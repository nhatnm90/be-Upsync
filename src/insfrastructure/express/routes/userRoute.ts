import { authMe } from '../../../presentation/controllers/userController'
import express from 'express'

const router = express.Router()

router.get('/me', authMe)

router.get('/test', (req, res) => {
  return res.sendStatus(204) // .status(204) //.json({ message: 'ok' })
})

export default router
