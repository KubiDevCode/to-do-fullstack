import UserService from "../services/UserService.js"
import TokenService from "../services/TokenService.js"

class UserController {
    async registration(req, res) {
        try {
            const { username, password, email } = req.body

            const userData = await UserService.registration(username, email, password)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })

            return res.json(userData)
        } catch (error) {
            console.log(error)
            return res.status(error.status || 400).json({ message: error.message })
        }
    }

    async activate(req, res) {
        try {
            const { link } = req.params
            const data = await UserService.activate(link)

            return res.json(data)
        } catch (error) {
            console.log(error)
            return res.status(error.status || 400).json({ message: error.message })
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body
            const userData = await UserService.login(username, password)

            await TokenService.saveToken(userData.user.id, userData.refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })

            return res.json(userData)
        } catch (error) {
            console.log(error)
            return res.status(error.status || 400).json({ message: error.message })
        }
    }

    async logout(req, res) {
        try {
            const { refreshToken } = req.cookies
            const token = await UserService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (error) {
            console.log(error)
            return res.status(error.status || 400).json({ message: error.message })
        }
    }

    async refresh(req, res) {
        try {
            const { refreshToken } = req.cookies
            const userData = await UserService.refresh(refreshToken)

            res.cookie('refreshToken', userData.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true
            })

            return res.json(userData)
        } catch (error) {
            console.log(error)
            return res.status(error.status || 401).json({ message: error.message })
        }
    }

    async getAllUsers(req, res) {
        try {
            const users = await User.find()
            users.push(req.user)
            console.log(req.user)
            res.json(users)
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: "err" })
        }
    }
}

export default new UserController()
