import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UseGuards
} from '@nestjs/common'
import { LoginDto } from './dto/login.dto'
import { AuthService } from './auth.service'
import { RefreshTokenGuard } from 'src/guard/refresh-token.guard'
import { UserId } from 'src/custom.decorator'
import { LogoutDto } from './dto/logout.dto'

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

  @UseGuards(RefreshTokenGuard)
  @Get('refresh/token')
  async refreshToken(@UserId() userId: string) {
    return this.authService.refreshToken(userId)
  }

  @Post('logout')
  async logout(@Body() { refreshToken, accessToken }: LogoutDto) {
    await this.authService.logout(refreshToken, accessToken)
    return '退出登录'
  }
}
