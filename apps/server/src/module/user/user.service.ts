import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { UserRepository } from '../../repository/user.repository'
import { FindUserQuery } from 'src/type'
import { FriendshipRepository } from 'src/repository/friendship.repository'

@Injectable()
export class UserService {
  @Inject()
  user: UserRepository

  @Inject()
  friend: FriendshipRepository

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

  async findOtherUser(userId: string, otherUser: FindUserQuery) {
    const { id, name, email } = otherUser
    if (!id && !name && !email) {
      throw new HttpException('查询信息为空', HttpStatus.BAD_REQUEST)
    }
    const user = await this.findUserById(userId)
    if (id === user.id || email === user.email || name === user.name) {
      throw new HttpException('请不要查找自己', HttpStatus.BAD_REQUEST)
    }
    return this.user.findOtherUserAndFriendship(userId, otherUser)
  }

  async findFriendList(userId: string) {
    return this.friend.findFriendList(userId)
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
