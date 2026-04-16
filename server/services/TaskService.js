import Task from "../Task/Task.js"
import User from '../User/User.js'

class TaskService {
    async create(post) {
        const createdPost = await Task.create(post)
        return createdPost
    }

    async getById(id) {
        const post = await Task.findById(id)
        return post
    }

    async getAll(userId) {
        const posts = await Task.find({ user: userId })
        return posts
    }

    async patchDone(id, updates) {
        const task = await Task.findByIdAndUpdate(id, { done: updates }, { new: true })
        return task
    }

    async patchPrivate(id, updates) {
        const task = await Task.findByIdAndUpdate(id, { isPrivate: updates }, { new: true })
        return task
    }

    async delete(id) {
        const task = await Task.findByIdAndDelete(id)
        return task
    }

    async getCompleted(userId) {
        const tasks = await Task.find({ done: true, user: userId })
        return tasks
    }

    async getNotCompleted(userId) {
        const tasks = await Task.find({ done: false, user: userId })
        return tasks
    }

    async findTask(user, params, filter) {
        let tasks
        switch (filter) {
            case 'completed':
                tasks = await Task.find({ user: user, done: true })
                break;

            case 'notCompleted':
                tasks = await Task.find({ user: user, done: false })
                break;

            default:
                tasks = await Task.find({ user: user })
                break;
        }

        const filterParams = params.toLowerCase().trim()
        const filteredTasks = tasks.filter((task) =>
            task.task.toLowerCase().trim().includes(filterParams)
        )

        return filteredTasks
    }

    async getAllUsersTask() {
        const allTasks = await Task.find({ isPrivate: false })
        const allUsers = await User.find()
        const allUserIds = allUsers.map(user => user._id)
        const usersWithTasks = allUsers.map((user) => ({
            user: {
                id: user._id,
                name: user.username,
            },
            tasks: allTasks.filter((task) => task.user.toString() === user._id.toString())
        }))

        return usersWithTasks
    }

    async getAllAdminTask() {
        const allTasks = await Task.find()
        const allUsers = await User.find()
        const allUserIds = allUsers.map(user => user._id)
        const usersWithTasks = allUsers.map((user) => ({
            user: {
                id: user._id,
                name: user.username,
            },
            tasks: allTasks.filter((task) => task.user.toString() === user._id.toString())
        }))

        return usersWithTasks
    }
}

export default new TaskService