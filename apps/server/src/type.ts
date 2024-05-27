type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U]

declare module 'express' {
  interface Request {
    userId: string
  }
}

export type TokenPayload = {
  userId: string
  type: 'access' | 'refresh'
  exp: number
  iat: number
}

export type FindUserQuery = AtLeastOne<{
  id: string
  name: string
  email: string
}>
