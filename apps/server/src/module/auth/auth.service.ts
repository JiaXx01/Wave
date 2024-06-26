import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UseGuards
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { EmailService } from 'src/email/email.service'
import { RefreshTokenGuard } from 'src/guard/refresh-token.guard'
import { RedisService } from 'src/redis/redis.service'
import { TokenPayload } from 'src/type'
import { UserRepository } from 'src/repository/user.repository'

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

  async emailLogin(email: string, code: string) {
    const cachedCode = await this.redis.getLoginCode(email)
    if (cachedCode !== code) {
      throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST)
    }
    await this.redis.delLoginCode(email)
    return await this.login(email)
  }

  async login(email: string) {
    let user = await this.user.findByEmail(email)
    if (!user) {
      user = await this.user.create({
        email
      })
    }

    const accessToken = this.getToken(user.id, 'access')
    const refreshToken = this.getToken(user.id, 'refresh')
    return { accessToken, refreshToken }
  }

  @UseGuards(RefreshTokenGuard)
  refreshToken(userId: string) {
    const accessToken = this.getToken(userId, 'access')
    const refreshToken = this.getToken(userId, 'refresh')
    return { accessToken, refreshToken }
  }

  async logout(refreshToken: string, accessToken?: string) {
    try {
      const { exp: refreshTokenExp } =
        this.jwt.verify<TokenPayload>(refreshToken)
      this.redis.addTokenBlacklist(refreshToken, refreshTokenExp)
      if (accessToken) {
        const { exp: accessTokenExp } =
          this.jwt.verify<TokenPayload>(accessToken)
        this.redis.addTokenBlacklist(accessToken, accessTokenExp)
      }
    } catch {
      throw new HttpException('无效token', HttpStatus.BAD_REQUEST)
    }
  }

  private getToken(userId: string, type: 'access' | 'refresh') {
    return this.jwt.sign(
      { userId, type },
      {
        expiresIn:
          type === 'access'
            ? process.env.JWT_ACCESS_TOKEN_EXPIRES
            : process.env.JWT_REFRESH_TOKEN_EXPIRES
      }
    )
  }
}
