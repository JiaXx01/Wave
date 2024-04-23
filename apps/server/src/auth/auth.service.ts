import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { EmailService } from 'src/email/email.service'
import { RedisService } from 'src/redis/redis.service'
import { TokenPayload } from 'src/type'
import { UserRepository } from 'src/user/user.repository'

@Injectable()
export class AuthService {
  @Inject()
  email: EmailService
  @Inject()
  redis: RedisService
  @Inject()
  user: UserRepository
  @Inject()
  jwt: JwtService

  async sendCode(email: string) {
    const code = Math.random().toString().slice(2, 8)
    await this.redis.setLoginCode(email, code)
    await this.email.sendLoginCode(email, code)
  }

  async login(email: string, code: string) {
    const cachedCode = await this.redis.getLoginCode(email)
    if (cachedCode !== code) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST)
    }
    // await this.redis.delLoginCode(email)

    let user = await this.user.findByEmail(email)
    if (!user) {
      user = await this.user.create({
        email
      })
    }

    const accessToken = this.getToken(
      user.id,
      user.email,
      process.env.JWT_ACCESS_TOKEN_EXPIRES!
    )
    const refreshToken = this.getToken(
      user.id,
      user.email,
      process.env.JWT_REFRESH_TOKEN_EXPIRES!
    )
    return {
      user,
      tokens: {
        accessToken,
        refreshToken
      }
    }
  }

  refreshToken(userId: string, email: string) {
    const accessToken = this.getToken(
      userId,
      email,
      process.env.JWT_ACCESS_TOKEN_EXPIRES!
    )
    return {
      accessToken
    }
  }

  async logout(accessToken: string, refreshToken: string) {
    const refreshTokenExp = this.jwt.verify<TokenPayload>(refreshToken).exp
    const accessTokenExp = this.jwt.verify<TokenPayload>(accessToken).exp
    await this.redis.addTokenBlacklist(refreshToken, refreshTokenExp)
    await this.redis.addTokenBlacklist(accessToken, accessTokenExp)
  }

  private getToken(userId: string, email: string, expires: string) {
    return this.jwt.sign(
      {
        userId,
        email
      },
      {
        expiresIn: expires
      }
    )
  }
}
