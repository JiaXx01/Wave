import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-github2'

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: 'http://localhost:4001/auth/callback/github',
      scope: ['user']
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { emails } = profile
    return {
      email: emails?.[0].value
    }
  }
}
