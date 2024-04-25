declare module 'express' {
  interface Request {
    userId: string
  }
}

export interface TokenPayload {
  userId: string
  exp: number
  iat: number
}
