import express from 'express'
import { signIn, signUp, signOut, refreshToken, signInWithExternal } from '@/presentation/controllers/authController'

const router = express.Router()

router.get('/test', (req, res) => {
  return res.status(200).json({ message: 'OK nha a' })
})
router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/signout', signOut)
router.post('/refreshtoken', refreshToken)
router.post('/signinwithexternal', signInWithExternal)

export default router
