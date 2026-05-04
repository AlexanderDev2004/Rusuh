import { useMutation } from '@tanstack/react-query'

import { ApiRequest } from '@/apis/auth/status/api'
import { useManagementAuth } from '@/features/auth/AuthGate'

import type { CopilotModelsResponse, FetchCopilotModelsInput } from './types'

export function fetchCopilotModels(secret: string, input: FetchCopilotModelsInput) {
  return ApiRequest<CopilotModelsResponse>('/v0/management/github-copilot/models', secret, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: input.name }),
  })
}

export function useFetchCopilotModelsMutation() {
  const { secret } = useManagementAuth()

  return useMutation({
    mutationFn: (input: FetchCopilotModelsInput) => fetchCopilotModels(secret, input),
  })
}
