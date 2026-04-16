import { Router } from 'express'
import UserController from './UserController.js'
import AuthMiddleware from '../middleware/AuthMiddleware.js'

const router = new Router()

router.post('/registration', UserController.registration)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
router.get('/users', AuthMiddleware, UserController.getAllUsers)
router.get('/activate/:link', UserController.activate)
router.get('/refresh',UserController.refresh)

export default router