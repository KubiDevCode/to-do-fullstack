import { Router } from 'express'
import { body } from 'express-validator'
import UserController from './UserController.js'
import AuthMiddleware from '../middleware/AuthMiddleware.js'

const router = new Router()

router.post('/registration',
    body('email').isEmail().withMessage('Неверный email'),
    body('password').isLength({ min: 3 }).withMessage('Слишком короткий пароль'),
    body('username').notEmpty().withMessage('Имя пустое'),
    UserController.registration)
router.post('/login',
    body('username').trim().notEmpty().withMessage('Имя пустое'),
    UserController.login)
router.post('/logout', UserController.logout)
router.get('/users', AuthMiddleware, UserController.getAllUsers)
router.get('/activate/:link', UserController.activate)
router.get('/refresh', UserController.refresh)

export default router