import { useMemo, useState } from 'react'

import { useDeleteAuthFileMutation, useManagementAuthFilesQuery } from '@/apis/auth/files/api'
import type { ManagementAuthFile } from '@/apis/auth/files/types'
import { toastError, toastSuccess } from '@/components/feedback/toast'

import type { ProviderGroup } from '../types'

const ALL_FILTER = 'all'
const STATUS_OPTIONS = ['active', 'refreshing', 'pending', 'error', 'disabled', 'unknown'] as const

function providerLabel(key: string) {
  if (key === 'kiro') return 'Kiro'
  if (key === 'antigravity') return 'Antigravity'
  if (key === 'zed') return 'Zed'
  if (key === 'codex') return 'Codex'
  if (key === 'github-copilot') return 'GitHub Copilot'
  return key
}

export function useAccountsModel() {
  const accounts = useManagementAuthFilesQuery()
  const deleteAuthFile = useDeleteAuthFileMutation()

  const [providerFilter, setProviderFilter] = useState(ALL_FILTER)
  const [statusFilter, setStatusFilter] = useState(ALL_FILTER)
  const [deleteTarget, setDeleteTarget] = useState<ManagementAuthFile | null>(null)

  const sourceItems = useMemo(() => accounts.data?.['auth-files'] ?? [], [accounts.data])

  const items = useMemo(
    () =>
      [...sourceItems]
        .filter((item) => providerFilter === ALL_FILTER || item.provider_key === providerFilter)
        .filter((item) => statusFilter === ALL_FILTER || item.status === statusFilter)
        .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at)),
    [sourceItems, providerFilter, statusFilter],
  )

  const providerGroups = useMemo<ProviderGroup[]>(() => {
    const map = new Map<string, ManagementAuthFile[]>()

    for (const item of items) {
      const existing = map.get(item.provider_key) ?? []
      existing.push(item)
      map.set(item.provider_key, existing)
    }

    return [...map.entries()].map(([key, groupedItems]) => ({
      key,
      label: providerLabel(key),
      items: groupedItems,
    }))
  }, [items])

  const providerOptions = useMemo(
    () => [...new Set(sourceItems.map((item) => item.provider_key))],
    [sourceItems],
  )

  const totalAccounts = sourceItems.length
  const visibleAccounts = items.length
  const activeAccounts = sourceItems.filter((item) => item.status === 'active').length
  const issueAccounts = sourceItems.filter(
    (item) => item.status === 'error' || item.status === 'unknown',
  ).length
  const hasItems = items.length > 0

  function clearFilters() {
    setProviderFilter(ALL_FILTER)
    setStatusFilter(ALL_FILTER)
  }

  function confirmDelete() {
    if (!deleteTarget) return
    const target = deleteTarget
    deleteAuthFile.mutate(target.id, {
      onSuccess: () => {
        toastSuccess('Account deleted', target.id)
        setDeleteTarget(null)
      },
      onError: (error) => {
        toastError('Failed to delete account', error.message)
        setDeleteTarget(null)
      },
    })
  }

  return {
    accounts,
    providerFilter,
    setProviderFilter,
    statusFilter,
    setStatusFilter,
    providerOptions,
    providerGroups,
    totalAccounts,
    visibleAccounts,
    activeAccounts,
    issueAccounts,
    hasItems,
    deleteTarget,
    setDeleteTarget,
    confirmDelete,
    clearFilters,
    providerLabel,
    filters: {
      all: ALL_FILTER,
      statusOptions: STATUS_OPTIONS,
    },
  }
}

export type AccountsModel = ReturnType<typeof useAccountsModel>
