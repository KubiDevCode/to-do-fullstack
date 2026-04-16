import jwt from 'jsonwebtoken'
import Token from '../Token/Token.js'

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(
            payload,
            process.env.SECRET_ACCESS,
            { expiresIn: '15m' }
        )

        const refreshToken = jwt.sign(
            payload,
            process.env.SECRET_REFRESH,
            { expiresIn: '30d' }
        )

        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.SECRET_ACCESS);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.SECRET_REFRESH);
            return userData;
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await Token.findOne({ user: userId })

        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return await tokenData.save()
        }

        const token = await Token.create({
            user: userId,
            refreshToken
        })

        return token
    }

    async deleteToken(refreshToken) {
        const token = await Token.deleteOne({ refreshToken: refreshToken })
        return token
    }

    async findToken(refreshToken) {
        const tokenData = await Token.findOne({ refreshToken })
        return tokenData;
    }
}

export default new TokenService()
