export type AuthFileStatusPayload = {
  status: string
  name: string
  disabled: boolean
}

export type AuthFileFieldsPayload = {
  status: string
  name: string
}

export type AuthFileDeletePayload = {
  status: string
  name: string
}

export type AuthFileUploadPayload = {
  status: string
  name: string
}

export type ManagementAuthFile = {
  id: string
  type: string
  provider_key: string
  label: string
  auth_method: string | null
  provider: string | null
  region: string | null
  start_url: string | null
  profile_arn: string | null
  email: string
  project_id: string
  status: string
  status_message: string | null
  disabled: boolean
  size: number
  updated_at: string
  last_refreshed_at: string | null
}

export type ManagementAuthFilesPayload = {
  'auth-files': ManagementAuthFile[]
}
