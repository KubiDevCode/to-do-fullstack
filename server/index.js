import express from 'express'
import mongoose from 'mongoose'
import './config/index.js'
const app = express()
import taskRouter from './Task/taskRouter.js'
import authRouter from './User/UserRouter.js'
import cookieParser from 'cookie-parser'
import ErrorMiddleware from './middleware/ErrorMiddleware.js'


app.use(express.json())
app.use(cookieParser())
app.use('/todo', taskRouter)
app.use('/todo', authRouter)
app.use(ErrorMiddleware)


async function startApp() {
    try {
        await mongoose.connect(process.env.DB_URL)
        app.listen(3000, () => {
            console.log(`Сервер запущен на порту 3000`)
        })
    } catch (e) {
        console.log(e)
    }
}

startApp()