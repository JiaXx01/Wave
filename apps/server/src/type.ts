declare module 'express' {
  interface Request {
    userId: string
  }
}

export interface TokenPayload {
  userId: string
  type: 'access' | 'refresh'
  exp: number
  iat: number
}
