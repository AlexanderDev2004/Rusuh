import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useMemo } from 'react'

import { queryKeys, useOverviewQuery } from '@/apis/dashboard/queries'
import { PageShell } from '@/components/layout/PageShell'
import { QueryState } from '@/components/shared/QueryState'
import { statusTone } from '@/components/shared/status_tone'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

import type { OverviewSummaryRow, StatusChip } from './types'

function providerLabel(key: string) {
  if (key === 'kiro') return 'Kiro'
  if (key === 'antigravity') return 'Antigravity'
  if (key === 'zed') return 'Zed'
  if (key === 'codex') return 'Codex'
  if (key === 'github-copilot') return 'GitHub Copilot'
  return key
}

export function OverviewPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
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

  return (
    <PageShell
      eyebrow='Dashboard'
      title='Runtime Overview'
      description='A compact operating view for routing health, providers, and account states.'
      actions={
        <Button
          type='button'
          variant='outline'
          onClick={() => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.overview })
          }}
          className='h-11 rounded-full px-5'
        >
          Refresh
        </Button>
      }
    >
      <QueryState
        isLoading={overview.isLoading}
        isError={overview.isError}
        error={overview.error as Error | null}
      >
        {overview.data ? (
          <div className='space-y-6'>
            {!hasProviders ? (
              <section className='dashboard-panel rounded-3xl p-5'>
                <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                  <div>
                    <p className='text-sm font-medium'>No providers connected</p>
                    <p className='text-muted-foreground mt-1 text-sm'>
                      Add an account first, then verify routing health here.
                    </p>
                  </div>
                  <Button
                    type='button'
                    onClick={() => void navigate({ to: '/accounts/add' })}
                    className='rounded-full px-5'
                  >
                    Add Account
                  </Button>
                </div>
              </section>
            ) : null}

            <section className='grid gap-4 lg:grid-cols-[1.15fr_0.85fr]'>
              <div className='dashboard-panel rounded-3xl p-5 md:p-6'>
                <div className='flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between'>
                  <div>
                    <p className='text-muted-foreground text-xs tracking-[0.2em] uppercase'>
                      Current Runtime
                    </p>
                    <h3 className='mt-2 text-2xl font-semibold tracking-[-0.03em]'>
                      {overview.data.health.status}
                    </h3>
                    <p className='text-muted-foreground mt-2 text-sm leading-6'>
                      {overview.data.health.service} is routing with{' '}
                      {overview.data.routing_strategy}.
                    </p>
                  </div>
                  <Badge variant='outline' className='w-fit rounded-full px-3 py-1 text-xs'>
                    {overview.data.available_model_count} models
                  </Badge>
                </div>

                <div className='dashboard-divider my-5' />

                <div className='grid gap-3 sm:grid-cols-3'>
                  <div className='border-border bg-muted/25 rounded-2xl border p-4'>
                    <p className='text-muted-foreground text-xs'>Providers</p>
                    <p className='mt-2 text-3xl font-semibold'>{providerNames.length}</p>
                  </div>
                  <div className='border-border bg-muted/25 rounded-2xl border p-4'>
                    <p className='text-muted-foreground text-xs'>Accounts</p>
                    <p className='mt-2 text-3xl font-semibold'>{totalAccounts}</p>
                  </div>
                  <div className='border-border bg-muted/25 rounded-2xl border p-4'>
                    <p className='text-muted-foreground text-xs'>Active</p>
                    <p className='mt-2 text-3xl font-semibold'>{activeAccounts}</p>
                  </div>
                </div>
              </div>

              <div className='dashboard-panel rounded-3xl p-5 md:p-6'>
                <p className='text-muted-foreground text-xs tracking-[0.2em] uppercase'>
                  Attention
                </p>
                <p className='mt-2 text-2xl font-semibold'>{issueAccounts}</p>
                <p className='text-muted-foreground mt-2 text-sm leading-6'>
                  Accounts marked error or unknown. Keep this number at zero before relying on the
                  proxy.
                </p>
                <div className='mt-5'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => void navigate({ to: '/accounts' })}
                    className='rounded-full px-5'
                  >
                    Review Accounts
                  </Button>
                </div>
              </div>
            </section>

            <section className='dashboard-panel overflow-hidden rounded-3xl'>
              <div className='border-border flex flex-col gap-2 border-b p-5 md:flex-row md:items-center md:justify-between'>
                <div>
                  <h3 className='text-lg font-semibold'>Provider Matrix</h3>
                  <p className='text-muted-foreground mt-1 text-sm'>
                    One row per provider, with all account states visible at once.
                  </p>
                </div>
                <Badge variant='outline' className='w-fit rounded-full px-3 py-1 text-xs'>
                  {summaryRows.length} provider{summaryRows.length === 1 ? '' : 's'}
                </Badge>
              </div>

              {summaryRows.length > 0 ? (
                <div className='divide-border divide-y'>
                  {summaryRows.map((row) => (
                    <div
                      key={row.provider}
                      className='grid gap-4 p-5 lg:grid-cols-[12rem_minmax(0,1fr)_5rem] lg:items-center'
                    >
                      <div>
                        <p className='font-medium'>{providerLabel(row.provider)}</p>
                        <p className='text-muted-foreground mt-1 text-xs'>{row.total} accounts</p>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {row.chips.length > 0 ? (
                          row.chips.map(([status, count]) => (
                            <Badge
                              key={status}
                              variant='outline'
                              className={`rounded-full px-2.5 py-1 text-xs ${statusTone(status)}`}
                            >
                              {status} · {count}
                            </Badge>
                          ))
                        ) : (
                          <span className='text-muted-foreground text-sm'>No status data</span>
                        )}
                      </div>
                      <p className='text-right text-2xl font-semibold lg:text-center'>
                        {row.total}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-muted-foreground p-5 text-sm'>No provider data yet.</div>
              )}
            </section>
          </div>
        ) : null}
      </QueryState>
    </PageShell>
  )
}
