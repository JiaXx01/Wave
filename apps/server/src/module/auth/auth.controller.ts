import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { AuthService } from './auth.service'
import { RefreshTokenGuard } from 'src/guard/refresh-token.guard'
import { UserId } from 'src/custom.decorator'
import { LogoutDto } from './dto/logout.dto'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'

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
  async login(@Body() { email, code }: LoginDto) {
    return await this.authService.login(email, code)
  }

  @Get('login/github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {}

  @UseGuards(RefreshTokenGuard)
  @Get('refresh/token')
  async refreshToken(@UserId() userId: string) {
    return this.authService.refreshToken(userId)
  }

  @Get('callback/github')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request) {
    return req.user
  }

  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request) {
    return req.user
  }

  @Post('logout')
  async logout(@Body() { refreshToken, accessToken }: LogoutDto) {
    await this.authService.logout(refreshToken, accessToken)
    return '退出登录'
  }
}
