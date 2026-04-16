import TokenService from '../services/TokenService.js'

export default function (req, res, next) {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.status(401).json({ message: 'Пользователь не авторизован' })
        }

        const token = authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({ message: 'Пользователь не авторизован' })
        }

        const userData = TokenService.validateAccessToken(token)

        if (!userData) {
            return res.status(401).json({ message: 'Пользователь не авторизован' })
        }

        req.user = userData
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ message: 'Пользователь не авторизован' })
    }
}