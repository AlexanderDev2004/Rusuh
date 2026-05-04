export type StartZedLoginResponse = {
  login_url: string
  session_id: string
  port: number
  status: 'waiting'
}

export type ZedLoginStatusResponse = {
  status: 'waiting' | 'completed'
  session_id?: string
  filename?: string
  user_id?: string
}

export type ZedQuotaResponse = {
  account: string
  status: 'available' | 'error'
  plan?: string | null
  plan_v2?: string | null
  plan_v3?: string | null
  subscription_started_at?: string | null
  subscription_ended_at?: string | null
  model_requests_used?: number | null
  model_requests_limit?: number | string | null
  edit_predictions_used?: number | null
  edit_predictions_limit?: string | number | null
  is_account_too_young?: boolean | null
  has_overdue_invoices?: boolean | null
  is_usage_based_billing_enabled?: boolean | null
  feature_flags?: string[]
  error?: string | null
  upstream_status?: number
}

export type ZedModelsResponse = {
  account: string
  provider_key: 'zed'
  models: string[]
}

export type StartZedLoginInput = {
  name?: string
}

export type CheckZedQuotaInput = {
  name: string
}

export type FetchZedModelsInput = {
  name: string
}
