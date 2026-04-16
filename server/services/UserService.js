import { v4 as uuidv4 } from 'uuid'
import User from '../User/User.js'
import bcrypt from 'bcryptjs'
import MailService from './MailService.js'
import UserDto from '../dto/user-dto.js'
import TokenService from './TokenService.js'

class UserService {
    async registration(username, email, password) {
        const candidate = await User.findOne({ username })

        if (candidate) {
            throw new Error('Пользователь уже зарегистрирован')
        }

        const hashPassword = bcrypt.hashSync(password, 5)
        const activationLink = uuidv4()

        const user = await User.create({
            username,
            email,
            password: hashPassword,
            activationLink,
            role
        })

        await MailService.sendActivationMail(
            email,
            `${process.env.API_URL}/todo/activate/${activationLink}`
        )

        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({ ...userDto })

        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink) {
        const user = await User.findOne({ activationLink })

        if (!user) {
            throw new Error('Некорректная ссылка активации')
        }

        user.isActivated = true
        user.activationLink = null
        await user.save()

        return user
    }

    async login(username, password) {
        const user = await User.findOne({ username })

        if (!user) {
            const error = new Error('Пользователь с таким ником не найден')
            error.status = 401
            throw error
        }

        const validPassword = bcrypt.compareSync(password, user.password)
        if (!validPassword) {
            const error = new Error('Введен неверный пароль')
            error.status = 401
            throw error
        }

        if (!user.isActivated) {
            const error = new Error('Аккаунт не активирован')
            error.status = 401
            throw error
        }

        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({ ...userDto })

        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token = await TokenService.deleteToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            const error = new Error('Пользователь не авторизован')
            error.status = 401
            throw error
        }

        const userData = TokenService.validateRefreshToken(refreshToken)
        const dbToken = await TokenService.findToken(refreshToken)

        if (!userData || !dbToken) {
            const error = new Error('Пользователь не авторизован')
            error.status = 401
            throw error
        }

        const user = await User.findById(userData.id)
        const userDto = new UserDto(user)
        const tokens = TokenService.generateTokens({ ...userDto })

        await TokenService.saveToken(userDto.id, tokens.refreshToken)

        return {
            ...tokens,
            user: userDto
        }
    }
}

export default new UserService()