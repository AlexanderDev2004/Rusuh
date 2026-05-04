import { ApiRequest } from '@/apis/auth/status/api'
import type { ApiKeysResponse, ReplaceApiKeyInput } from '@/features/api-keys/types'

export function generateApiKey(secret: string) {
  return ApiRequest<ApiKeysResponse>('/v0/management/api-keys', secret, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ generate: true }),
  })
}

export function appendApiKey(secret: string, value: string) {
  return ApiRequest<ApiKeysResponse>('/v0/management/api-keys', secret, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value }),
  })
}

export function replaceApiKey(secret: string, input: ReplaceApiKeyInput) {
  return ApiRequest<ApiKeysResponse>('/v0/management/api-keys', secret, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  })
}

export function deleteApiKey(secret: string, index: number) {
  return ApiRequest<ApiKeysResponse>(`/v0/management/api-keys?index=${index}`, secret, {
    method: 'DELETE',
  })
}

export function clearApiKeys(secret: string) {
  return ApiRequest<ApiKeysResponse>('/v0/management/api-keys?all=true', secret, {
    method: 'DELETE',
  })
}
