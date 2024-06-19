import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile } from 'passport-google-oauth20'
import { SocksProxyAgent } from 'socks-proxy-agent'

const Agent = new SocksProxyAgent(
  process.env.SOCKS5_PROXY || 'socks5://127.0.0.1:7890'
)

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:4001/auth/callback/google',
      scope: ['email', 'profile']
    })
    this._oauth2.setAgent(Agent)
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    console.log(profile)
    const { name, emails, photos } = profile
    const user = {
      email: emails?.[0].value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      picture: photos?.[0].value,
      accessToken
    }
    return user
  }
}
