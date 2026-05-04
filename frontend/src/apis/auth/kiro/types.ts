export type StartKiroBuilderIdPayload = {
  session_id: string
  auth_url: string
  expires_at: string
  auth_method: 'builder-id'
  provider_key: 'kiro'
}

export type ImportKiroPayload = {
  status: string
  name: string
  provider_key: 'kiro'
  label: string
  auth_method: string
  provider: string
}

export type ImportKiroInput = {
  access_token: string
  refresh_token: string
  expires_at: string
  client_id: string
  client_secret: string
  profile_arn?: string
  auth_method?: string
  provider?: string
  region?: string
  start_url?: string
  email?: string
  label?: string
}

export type ImportKiroSocialInput = {
  refresh_token: string
  label?: string
}
