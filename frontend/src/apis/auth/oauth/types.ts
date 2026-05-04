export type OAuthProvider =
  | 'antigravity'
  | 'kiro-google'
  | 'kiro-github'
  | 'codex'
  | 'github-copilot'

export type StartOAuthResponse = {
  status: string
  url?: string
  state: string
  provider: string
  device_code?: string
  user_code?: string
  verification_uri?: string
  expires_in?: number
  interval?: number
}

export type OAuthStatusResponse = {
  status: 'wait' | 'ok' | 'error'
  provider?: string
  error?: string
}

export type SubmitOAuthCallbackResponse = {
  status: string
  error?: string
}
