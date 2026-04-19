import { Router } from 'express'
import TaskController from './TaskController.js'
import AuthMiddleware from '../middleware/AuthMiddleware.js'
import AdminMiddleware from '../middleware/AdminMiddleware.js'
import { body } from 'express-validator'

const router = new Router

router.post('/tasks',
    body('task').isLength({ min: 3 }).withMessage('Слишком короткая задача'),
    AuthMiddleware, TaskController.create)
router.get('/tasks', AuthMiddleware, TaskController.getAll)
router.get('/alltasks', AuthMiddleware, TaskController.getAllUsersTask)
router.get('/alltasks/admin', AuthMiddleware, AdminMiddleware, TaskController.getAllAdminTask)
router.patch('/tasks/:id', AuthMiddleware, TaskController.patchDone)
router.patch('/tasks/private/:id', AuthMiddleware, TaskController.patchPrivate)
router.get('/tasks/:id', AuthMiddleware, TaskController.getById)
router.delete('/tasks/:id', AuthMiddleware, TaskController.delete)
router.post('/find',
    body('findTask').notEmpty().withMessage('Не должно быть пустое')
    , AuthMiddleware, TaskController.findTask)

export default router