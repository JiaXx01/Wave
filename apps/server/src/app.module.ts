import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './module/user/user.module'
import { AuthModule } from './module/auth/auth.module'
import { EmailModule } from './email/email.module'
import { ConfigModule } from '@nestjs/config'
import { RedisModule } from './redis/redis.module'
import { JwtModule } from '@nestjs/jwt'
import { NoteModule } from './module/note/note.module'

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES
      }
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    EmailModule,
    RedisModule,
    NoteModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
