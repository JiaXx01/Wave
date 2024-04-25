export function getTokens() {
  return {
    accessToken: window.localStorage.getItem('accessToken'),
    refreshToken: window.localStorage.getItem('refreshToken')
  }
}

export function setTokens({
  accessToken,
  refreshToken
}: {
  accessToken?: string
  refreshToken?: string
}) {
  accessToken && window.localStorage.setItem('accessToken', accessToken)
  refreshToken && window.localStorage.setItem('refreshToken', refreshToken)
}

export function removeTokens() {
  window.localStorage.removeItem('accessToken')
  window.localStorage.removeItem('refreshToken')
}
