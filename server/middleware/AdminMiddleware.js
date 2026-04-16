import TokenService from '../services/TokenService.js'
import jwt from 'jsonwebtoken';

export default function (req, res, next) {
    try {
        const authHeader = req.headers.authorization

        const token = authHeader.split(' ')[1]

        const userData = jwt.verify(token, process.env.SECRET_ACCESS)

        const userRole = userData.role

        if (userRole === 'USER') {
            return res.status(402).json({ message: 'отказано в доступе' })
        }

        next()
    } catch (error) {
        console.log(error)
        return res.status(402).json({ message: 'отказано в доступе' })
    }
}