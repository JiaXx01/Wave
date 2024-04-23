declare module 'express' {
  interface Request {
    user: ReqUserInfo
  }
}

export interface TokenPayload {
  userId: string
  email: string
  exp: number
  iat: number
}

export interface ReqUserInfo {
  userId: string
  email: string
}
