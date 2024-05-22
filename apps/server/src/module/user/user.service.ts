import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
  @Inject()
  user: UserRepository

  async findUserById(id: string) {
    const user = await this.user.findById(id)
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.UNAUTHORIZED)
    }
    return user
  }

  async initName(id: string, name: string) {
    await this.verifyName(name)
    await this.user.setName(id, name)
  }

  private async verifyName(name: string) {
    /**
     * 检验名称是否合法
     */

    // 检验名称是已被使用
    const user = await this.user.findByName(name)
    if (user) throw new HttpException('名称已存在', HttpStatus.BAD_REQUEST)
  }
}
