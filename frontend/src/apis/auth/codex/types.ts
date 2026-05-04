export type CodexQuotaWindow = {
  used_percent?: number
  limit_window_seconds?: number
  reset_after_seconds?: number
  reset_at?: number
}

export type CodexQuotaBucket = {
  allowed?: boolean
  limit_reached?: boolean
  primary_window?: CodexQuotaWindow | null
  secondary_window?: CodexQuotaWindow | null
}

export type CodexCredits = {
  has_credits?: boolean
  unlimited?: boolean
  balance?: number | null
  approx_local_messages?: number | null
  approx_cloud_messages?: number | null
}

export type CodexSpendControl = {
  reached?: boolean
}

export type CodexQuotaResponse = {
  account: string
  status: 'available' | 'exhausted' | 'error'
  detail?: string
  retry_after_seconds?: number
  upstream_status: number
  plan_type?: string
  account_id?: string
  email?: string
  rate_limit?: CodexQuotaBucket
  code_review_rate_limit?: CodexQuotaBucket
  additional_rate_limits?: unknown
  credits?: CodexCredits
  spend_control?: CodexSpendControl
  raw_response?: unknown
}

export type CheckCodexQuotaInput = {
  name: string
}
