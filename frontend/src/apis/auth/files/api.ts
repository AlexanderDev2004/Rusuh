import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { ApiRequest } from '@/apis/auth/status/api'
import { queryKeys } from '@/apis/dashboard/queries'
import { useManagementAuth } from '@/features/auth/AuthGate'

import type {
  AuthFileDeletePayload,
  AuthFileFieldsPayload,
  AuthFileStatusPayload,
  AuthFileUploadPayload,
  ManagementAuthFilesPayload,
} from './types'

export function useManagementAuthFilesQuery() {
  const { secret } = useManagementAuth()

  return useQuery({
    queryKey: queryKeys.accounts,
    queryFn: () => ApiRequest<ManagementAuthFilesPayload>('/v0/management/auth-files', secret),
    enabled: secret.trim().length > 0,
  })
}

export function useToggleAuthFileStatusMutation() {
  const queryClient = useQueryClient()
  const { secret } = useManagementAuth()

  return useMutation({
    mutationFn: ({ name, disabled }: { name: string; disabled: boolean }) =>
      ApiRequest<AuthFileStatusPayload>('/v0/management/auth-files/status', secret, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, disabled }),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      void queryClient.invalidateQueries({ queryKey: queryKeys.overview })
    },
  })
}

export function usePatchAuthFileFieldsMutation() {
  const queryClient = useQueryClient()
  const { secret } = useManagementAuth()

  return useMutation({
    mutationFn: ({ name, label }: { name: string; label: string }) =>
      ApiRequest<AuthFileFieldsPayload>('/v0/management/auth-files/fields', secret, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, label }),
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      void queryClient.invalidateQueries({ queryKey: queryKeys.overview })
    },
  })
}

export function useDeleteAuthFileMutation() {
  const queryClient = useQueryClient()
  const { secret } = useManagementAuth()

  return useMutation({
    mutationFn: (name: string) =>
      ApiRequest<AuthFileDeletePayload>(
        `/v0/management/auth-files?name=${encodeURIComponent(name)}`,
        secret,
        {
          method: 'DELETE',
        },
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      void queryClient.invalidateQueries({ queryKey: queryKeys.overview })
    },
  })
}

export function useUploadAuthFileMutation() {
  const queryClient = useQueryClient()
  const { secret } = useManagementAuth()

  return useMutation({
    mutationFn: ({ name, body }: { name: string; body: string }) =>
      ApiRequest<AuthFileUploadPayload>(
        `/v0/management/auth-files?name=${encodeURIComponent(name)}`,
        secret,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body,
        },
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      void queryClient.invalidateQueries({ queryKey: queryKeys.overview })
    },
  })
}

export function downloadAuthFile(name: string) {
  const url = `/v0/management/auth-files/download?name=${encodeURIComponent(name)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
