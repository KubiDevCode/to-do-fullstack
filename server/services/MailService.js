import nodemailer from 'nodemailer'

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            }
        })
    }

    async sendActivationMail(to, activationLink) {

        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта',
            text: `Для активации аккаунта перейдите по ссылке: ${activationLink}`,
            html: `
                <div>
                    <h1>Для активации перейдите по ссылке</h1>
                    <a href="${activationLink}">ссылочка</a>
                </div>
            `
        })
    }
}

export default new MailService()