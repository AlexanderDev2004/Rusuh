import { useMemo } from 'react'

import { useOverviewQuery } from '@/apis/dashboard/queries'

import type { OverviewSummaryRow, StatusChip } from '../types'

function providerLabel(key: string) {
  if (key === 'kiro') return 'Kiro'
  if (key === 'antigravity') return 'Antigravity'
  if (key === 'zed') return 'Zed'
  if (key === 'codex') return 'Codex'
  if (key === 'github-copilot') return 'GitHub Copilot'
  return key
}

export function useOverviewModel() {
  const overview = useOverviewQuery()
  const accountSummaries = overview.data?.account_summaries
  const providerNames = overview.data?.provider_names ?? []

  const summaryRows = useMemo<OverviewSummaryRow[]>(
    () =>
      (accountSummaries ?? []).map((summary) => ({
        ...summary,
        chips: [
          ['active', summary.active],
          ['refreshing', summary.refreshing],
          ['pending', summary.pending],
          ['error', summary.error],
          ['disabled', summary.disabled],
          ['unknown', summary.unknown],
        ].filter(([, count]) => Number(count) > 0) as StatusChip[],
      })),
    [accountSummaries],
  )

  const totalAccounts = summaryRows.reduce((sum, row) => sum + row.total, 0)
  const activeAccounts = summaryRows.reduce((sum, row) => sum + row.active, 0)
  const issueAccounts = summaryRows.reduce((sum, row) => sum + row.error + row.unknown, 0)
  const hasProviders = providerNames.length > 0

  return {
    overview,
    providerNames,
    summaryRows,
    totalAccounts,
    activeAccounts,
    issueAccounts,
    hasProviders,
    providerLabel,
  }
}

export type OverviewModel = ReturnType<typeof useOverviewModel>
