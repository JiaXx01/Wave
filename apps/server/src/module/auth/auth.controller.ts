import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  Req,
  Res,
  UseGuards
} from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { AuthService } from './auth.service'
import { RefreshTokenGuard } from 'src/guard/refresh-token.guard'
import { UserId } from 'src/custom.decorator'
import { LogoutDto } from './dto/logout.dto'
import { AuthGuard } from '@nestjs/passport'
import { Request, Response } from 'express'

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
  async emailLogin(@Body() { email, code }: LoginDto) {
    return await this.authService.emailLogin(email, code)
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh/token')
  async refreshToken(@UserId() userId: string) {
    return this.authService.refreshToken(userId)
  }

  @Get('login/github')
  @UseGuards(AuthGuard('github'))
  async githubLogin() {}

  @Get('callback/github')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request, @Res() res: Response) {
    const email = req.user.email as string
    const { accessToken, refreshToken } = await this.authService.login(email)
    res.redirect(
      `http://localhost:5173/login?accessToken=${accessToken}&refreshToken=${refreshToken}`
    )
  }

  @Get('login/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}

  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const email = req.user.email as string
    const { accessToken, refreshToken } = await this.authService.login(email)
    res.redirect(
      `http://localhost:5173/login?accessToken=${accessToken}&refreshToken=${refreshToken}`
    )
  }

  @Post('logout')
  async logout(@Body() { refreshToken, accessToken }: LogoutDto) {
    await this.authService.logout(refreshToken, accessToken)
    return '退出登录'
  }
}
