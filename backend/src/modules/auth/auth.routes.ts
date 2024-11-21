import { Router, RequestHandler } from 'express'
import { AuthController } from './auth.controller.js'
import { authenticate, authenticateRegistration } from './auth.middleware.js'

const router = Router()
const authController = new AuthController()

// Bind controller methods
const loginWithPhone: RequestHandler = authController.loginWithPhone.bind(authController)
const verifyLoginCode: RequestHandler = authController.verifyLoginCode.bind(authController)
const sendVerificationCode: RequestHandler = authController.sendVerificationCode.bind(authController)
const verifyCode: RequestHandler = authController.verifyCode.bind(authController)
const completeProfile: RequestHandler = authController.completeProfile.bind(authController)
const getMe: RequestHandler = authController.getMe.bind(authController)
const refreshToken: RequestHandler = authController.refreshToken.bind(authController)

// Registration flow
router.post('/verify-phone', sendVerificationCode)
router.post('/verify-code', verifyCode)
router.post('/complete-profile', authenticateRegistration as RequestHandler, completeProfile)

// Login flow
router.post('/login', loginWithPhone)
router.post('/verify-login', verifyLoginCode)

// Auth check
router.get('/me', authenticate as RequestHandler, getMe)

// Token refresh
router.post('/refresh-token', refreshToken)

export default router 