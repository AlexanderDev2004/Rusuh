import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { ApiRequest } from '@/apis/auth/status/api'
import { queryKeys } from '@/apis/dashboard/queries'
import { useManagementAuth } from '@/features/auth/AuthGate'

import type {
  StartZedLoginResponse,
  ZedLoginStatusResponse,
  ZedQuotaResponse,
  ZedModelsResponse,
  StartZedLoginInput,
  CheckZedQuotaInput,
  FetchZedModelsInput,
} from './types'

export function startZedLogin(secret: string, input: StartZedLoginInput = {}) {
  const name = input.name?.trim()

  return ApiRequest<StartZedLoginResponse>('/v0/management/zed/login/initiate', secret, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(name ? { name } : {}),
  })
}

export function fetchZedLoginStatus(secret: string, sessionId: string) {
  return ApiRequest<ZedLoginStatusResponse>(
    `/v0/management/zed/login/status?session_id=${encodeURIComponent(sessionId)}`,
    secret,
  )
}

export function checkZedQuota(secret: string, input: CheckZedQuotaInput) {
  return ApiRequest<ZedQuotaResponse>('/v0/management/zed/check-quota', secret, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: input.name }),
  })
}

export function fetchZedModels(secret: string, input: FetchZedModelsInput) {
  return ApiRequest<ZedModelsResponse>('/v0/management/zed/models', secret, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: input.name }),
  })
}

export function useStartZedLoginMutation() {
  const { secret } = useManagementAuth()

  return useMutation({
    mutationFn: (input: StartZedLoginInput) => startZedLogin(secret, input),
  })
}

export function useZedLoginStatusQuery(sessionId: string | null, enabled = true) {
  const queryClient = useQueryClient()
  const { secret } = useManagementAuth()
  const query = useQuery<ZedLoginStatusResponse>({
    queryKey: ['management', 'zed-login-status', sessionId],
    queryFn: () => fetchZedLoginStatus(secret, sessionId ?? ''),
    enabled: enabled && Boolean(sessionId),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      return status === 'waiting' || status === undefined ? 1500 : false
    },
  })

  if (query.data?.status === 'completed') {
    void queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
    void queryClient.invalidateQueries({ queryKey: queryKeys.overview })
  }

  return query
}

export function useCheckZedQuotaMutation() {
  const { secret } = useManagementAuth()

  return useMutation({
    mutationFn: (input: CheckZedQuotaInput) => checkZedQuota(secret, input),
  })
}

export function useFetchZedModelsMutation() {
  const { secret } = useManagementAuth()

  return useMutation({
    mutationFn: (input: FetchZedModelsInput) => fetchZedModels(secret, input),
  })
}
