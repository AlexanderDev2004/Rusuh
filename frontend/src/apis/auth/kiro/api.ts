import { useMutation, useQueryClient } from '@tanstack/react-query'

import { ApiRequest } from '@/apis/auth/status/api'
import { queryKeys } from '@/apis/dashboard/queries'
import { useManagementAuth } from '@/features/auth/AuthGate'

import type {
  StartKiroBuilderIdPayload,
  ImportKiroPayload,
  ImportKiroInput,
  ImportKiroSocialInput,
} from './types'

export function useStartKiroBuilderIdMutation() {
  const { secret } = useManagementAuth()

  return useMutation({
    mutationFn: ({ label }: { label?: string }) =>
      ApiRequest<StartKiroBuilderIdPayload>('/v0/management/kiro/builder-id/start', secret, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ label }),
      }),
  })
}

export function useImportKiroMutation() {
  const queryClient = useQueryClient()
  const { secret } = useManagementAuth()

  return useMutation({
    mutationFn: (input: ImportKiroInput) =>
      ApiRequest<ImportKiroPayload>('/v0/management/kiro/import', secret, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      void queryClient.invalidateQueries({ queryKey: queryKeys.overview })
    },
  })
}

export function useImportKiroSocialMutation() {
  const queryClient = useQueryClient()
  const { secret } = useManagementAuth()

  return useMutation({
    mutationFn: (input: ImportKiroSocialInput) =>
      ApiRequest<ImportKiroPayload>('/v0/management/kiro/social/import', secret, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      void queryClient.invalidateQueries({ queryKey: queryKeys.overview })
    },
  })
}

export function useCheckKiroQuotaMutation() {
  const { secret } = useManagementAuth()

  return useMutation({
    mutationFn: ({ name }: { name: string }) =>
      ApiRequest<{
        status: 'unknown' | 'available' | 'exhausted'
        remaining?: number
        detail?: string
        message?: string
      }>('/v0/management/kiro/check-quota', secret, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      }),
  })
}
