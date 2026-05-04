import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  appendApiKey,
  clearApiKeys,
  deleteApiKey,
  generateApiKey,
  replaceApiKey,
} from '@/apis/dashboard/api-keys/api'
import { queryKeys } from '@/apis/dashboard/queries'
import { toastError, toastSuccess } from '@/components/feedback/toast'
import { useManagementAuth } from '@/features/auth/AuthGate'

import type { ReplaceApiKeyInput } from '../types'

export function useApiKeyActions() {
  const queryClient = useQueryClient()
  const { secret } = useManagementAuth()
  const refresh = () => queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys })

  const generateKey = useMutation({
    mutationFn: () => generateApiKey(secret),
    onSuccess: () => {
      toastSuccess('API key generated', 'Copy the secret before using it in a client.')
      void refresh()
    },
    onError: (error) => {
      toastError('Failed to generate API key', error.message)
    },
  })

  const appendKey = useMutation({
    mutationFn: (value: string) => appendApiKey(secret, value),
    onSuccess: () => {
      toastSuccess('API key created', 'The key was added to the runtime config.')
      void refresh()
    },
    onError: (error) => {
      toastError('Failed to create API key', error.message)
    },
  })

  const replaceKey = useMutation({
    mutationFn: (input: ReplaceApiKeyInput) => replaceApiKey(secret, input),
    onSuccess: () => {
      toastSuccess('API key replaced', 'Clients using the old secret must be updated.')
      void refresh()
    },
    onError: (error) => {
      toastError('Failed to replace API key', error.message)
    },
  })

  const deleteKey = useMutation({
    mutationFn: (index: number) => deleteApiKey(secret, index),
    onSuccess: () => {
      toastSuccess('API key deleted', 'The secret can no longer authenticate clients.')
      void refresh()
    },
    onError: (error) => {
      toastError('Failed to delete API key', error.message)
    },
  })

  const clearKeys = useMutation({
    mutationFn: () => clearApiKeys(secret),
    onSuccess: () => {
      toastSuccess('API keys cleared', 'All client secrets were removed.')
      void refresh()
    },
    onError: (error) => {
      toastError('Failed to clear API keys', error.message)
    },
  })

  const mutationError = [generateKey, appendKey, replaceKey, deleteKey, clearKeys].find(
    (mutation) => mutation.isError,
  )?.error as Error | undefined

  return {
    appendKey,
    clearKeys,
    deleteKey,
    generateKey,
    mutationError,
    replaceKey,
  }
}
