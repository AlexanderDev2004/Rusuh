import { useMutation } from '@tanstack/react-query'

import { ApiRequest } from '@/apis/auth/status/api'
import { useManagementAuth } from '@/features/auth/AuthGate'

import type { CheckCodexQuotaInput, CodexQuotaResponse } from './types'

export function checkCodexQuota(secret: string, input: CheckCodexQuotaInput) {
  return ApiRequest<CodexQuotaResponse>('/v0/management/codex/check-quota', secret, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: input.name }),
  })
}

export function useCheckCodexQuotaMutation() {
  const { secret } = useManagementAuth()

  return useMutation({
    mutationFn: (input: CheckCodexQuotaInput) => checkCodexQuota(secret, input),
  })
}
