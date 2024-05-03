import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { AuthGuard } from 'src/guard/auth.guard'
import { UserId } from 'src/custom.decorator'
import { InitNameDto } from './dto/init-name.dto'

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async findMe(@UserId() userId: string) {
    return await this.userService.findUserById(userId)
  }

  @Post('name')
  async initName(@UserId() userId: string, @Body() { name }: InitNameDto) {
    await this.userService.initName(userId, name)
    return '名称设置成功'
  }
}
