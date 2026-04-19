import { ApiError } from '../ApiError.js'
import TaskService from '../services/TaskService.js'
import { validationResult } from "express-validator"

class TaskController {
    async create(req, res, next) {
        try {
            const task = req.body
            task.user = req.user.id

            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                next(ApiError.ValidError(errors))
            }

            const post = await TaskService.create(task)
            res.json(post)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    async getAll(req, res) {
        try {
            const { filter } = req.query
            const userId = req.user.id
            let tasks

            switch (filter) {
                case undefined:
                case 'all':
                    tasks = await TaskService.getAll(userId)
                    break
                case 'completed':
                    tasks = await TaskService.getCompleted(userId)
                    break
                case 'notCompleted':
                    tasks = await TaskService.getNotCompleted(userId)
                    break
                default:
                    return res.status(400).json({ message: 'Invalid filter value' })
            }

            res.json(tasks)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    async getById(req, res) {
        try {
            const id = req.params.id
            const post = await TaskService.getById(id)
            if (!post) return res.status(404).json({ message: 'Task not found' })
            res.json(post)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    async patchDone(req, res) {
        try {
            const id = req.params.id
            const { done } = req.body       // вытаскиваем только поле done
            const task = await TaskService.patchDone(id, done)
            if (!task) return res.status(404).json({ message: 'Task not found' })
            res.json(task)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    async patchPrivate(req, res) {
        try {
            const id = req.params.id
            const { isPrivate } = req.body
            const task = await TaskService.patchPrivate(id, isPrivate)
            if (!task) return res.status(404).json({ message: 'Task not found' })
            res.json(task)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id
            const post = await TaskService.getById(id)
            const user = req.user
            const validAuth = user.id === post.user.toString() || user.role === "ADMIN"

            if (!validAuth) {
                return res.status(400).json({ message: "отказано в доступе" })
            }
            const task = await TaskService.delete(id)
            if (!task) return res.status(404).json({ message: 'Task not found' })

            return res.json(task)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    async findTask(req, res) {
        try {
            const { userId, findTask, filter } = req.body

            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                next(ApiError.ValidError(errors))
            }

            if (!userId) {
                return res.status(400).json({ message: 'нет userid' })
            }

            const filteredTask = await TaskService.findTask(userId, findTask, filter)

            if (!filteredTask) {
                return res.status(404).json({ message: 'Task not found' })
            }

            res.json(filteredTask)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    async getAllUsersTask(req, res) {
        try {
            const uersTasks = await TaskService.getAllUsersTask()
            return res.json(uersTasks)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }

    async getAllAdminTask(req, res) {
        try {
            const uersTasks = await TaskService.getAllAdminTask()
            return res.json(uersTasks)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

export default new TaskController()