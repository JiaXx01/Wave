import { Injectable } from '@nestjs/common'
import { createTransport, Transporter, SendMailOptions } from 'nodemailer'

@Injectable()
export class EmailService {
  private transporter: Transporter

  constructor() {
    this.transporter = createTransport({
      service: 'QQ',
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
      }
    })
  }

  async sendEmail(mailOptions: SendMailOptions) {
    return this.transporter.sendMail(mailOptions)
  }

  async sendLoginCode(email: string, code: string) {
    this.sendEmail({
      from: {
        address: process.env.EMAIL_FROM!,
        name: 'Wave'
      },
      subject: '登录验证码',
      to: email,
      html: `
        <div>
          <h1>Wave</h1>
          <p>登录验证码为：${code}，有效期5分钟</p>
        </div>
      `
    })
  }
}
