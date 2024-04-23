import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Res,
  UseGuards
} from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { AuthService } from './auth.service'
import { RefreshTokenGuard } from 'src/guard/refresh-token.guard'
import { User } from 'src/custom.decorator'
import { ReqUserInfo } from 'src/type'
import { Response } from 'express'

@Controller('auth')
export class AuthController {
  @Inject()
  authService: AuthService

  @Get('login/code')
  async sendCode(@Query('email') email: string) {
    await this.authService.sendCode(email)
    return '邮箱验证码发送成功'
  }

  @Post('login')
  async login(@Body() { email, code }: LoginDto, @Res() response: Response) {
    const loginInfo = await this.authService.login(email, code)
    response.cookie('access_token', loginInfo.tokens.accessToken, {
      httpOnly: true
    })
    response.cookie('refresh_token', loginInfo.tokens.refreshToken, {
      httpOnly: true
    })
    response.send(loginInfo)
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh/token')
  async refreshToken(@User() user: ReqUserInfo) {
    const { userId, email } = user
    return this.authService.refreshToken(userId, email)
  }

  @Get('logout')
  async logout() {
    const accessToken = 'xxx'
    const refreshToken = 'xxx'
    await this.authService.logout(accessToken, refreshToken)
    return '退出登录'
  }
}
