import { useNavigate } from '@tanstack/react-router'
import { Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'

import { useDeleteAuthFileMutation, useManagementAuthFilesQuery } from '@/apis/auth/files/api'
import type { ManagementAuthFile } from '@/apis/auth/files/types'
import { toastError, toastSuccess } from '@/components/feedback/toast'
import { PageShell } from '@/components/layout/PageShell'
import { QueryState } from '@/components/shared/QueryState'
import { statusTone } from '@/components/shared/status_tone'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/AlertDialog'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'

import type { ProviderGroup } from './types'

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

export function AccountsPage() {
  const navigate = useNavigate()
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

  return (
    <PageShell
      eyebrow='Accounts'
      title='Accounts'
      description='A provider-first account board with filters, totals, and visible account states.'
      actions={
        <Button
          type='button'
          onClick={() => void navigate({ to: '/accounts/add' })}
          className='rounded-full px-5'
        >
          Add Account
        </Button>
      }
    >
      <QueryState
        isLoading={accounts.isLoading}
        isError={accounts.isError}
        error={accounts.error as Error | null}
      >
        {accounts.data ? (
          <>
            <AlertDialog
              open={deleteTarget !== null}
              onOpenChange={(open) => {
                if (!open) setDeleteTarget(null)
              }}
            >
              <AlertDialogContent className='rounded-3xl'>
                <AlertDialogHeader>
                  <AlertDialogMedia>
                    <Trash2 className='size-5' />
                  </AlertDialogMedia>
                  <AlertDialogTitle>Delete account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {deleteTarget
                      ? `This removes ${deleteTarget.id}. This action cannot be undone.`
                      : 'This action cannot be undone.'}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className='rounded-full px-5'>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant='destructive'
                    className='rounded-full px-5'
                    onClick={() => {
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
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <div className='space-y-6'>
              <section className='grid gap-3 sm:grid-cols-2 xl:grid-cols-4'>
                {[
                  ['Total', totalAccounts],
                  ['Visible', visibleAccounts],
                  ['Active', activeAccounts],
                  ['Issues', issueAccounts],
                ].map(([label, value]) => (
                  <div key={label} className='dashboard-panel rounded-3xl p-4'>
                    <p className='text-muted-foreground text-xs tracking-[0.18em] uppercase'>
                      {label}
                    </p>
                    <p className='mt-2 text-3xl font-semibold'>{value}</p>
                  </div>
                ))}
              </section>

              <section className='dashboard-panel rounded-3xl p-4'>
                <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
                  <div className='flex flex-1 flex-wrap items-end gap-3'>
                    <label className='space-y-2'>
                      <span className='text-muted-foreground text-sm'>Provider</span>
                      <Select value={providerFilter} onValueChange={setProviderFilter}>
                        <SelectTrigger className='bg-muted/35 h-11 min-w-44 rounded-2xl border-0 focus-visible:border-0'>
                          <SelectValue placeholder='All providers' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ALL_FILTER}>All providers</SelectItem>
                          {providerOptions.map((provider) => (
                            <SelectItem key={provider} value={provider}>
                              {providerLabel(provider)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>

                    <label className='space-y-2'>
                      <span className='text-muted-foreground text-sm'>Status</span>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className='bg-muted/35 h-11 min-w-40 rounded-2xl border-0 focus-visible:border-0'>
                          <SelectValue placeholder='All statuses' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={ALL_FILTER}>All statuses</SelectItem>
                          {STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </label>

                    {providerFilter !== ALL_FILTER || statusFilter !== ALL_FILTER ? (
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() => {
                          setProviderFilter(ALL_FILTER)
                          setStatusFilter(ALL_FILTER)
                        }}
                        className='h-11 rounded-full px-5'
                      >
                        Clear
                      </Button>
                    ) : null}
                  </div>

                  <p className='text-muted-foreground text-sm'>
                    {visibleAccounts} of {totalAccounts} account{totalAccounts === 1 ? '' : 's'}
                  </p>
                </div>
              </section>

              {!hasItems ? (
                <section className='dashboard-panel rounded-3xl p-8 text-center'>
                  <Badge variant='outline' className='mb-4 rounded-full'>
                    No accounts found
                  </Badge>
                  <p className='text-muted-foreground mx-auto max-w-xl text-sm leading-6'>
                    Connected provider accounts appear here. Add at least one account to start
                    routing requests.
                  </p>
                  <Button
                    type='button'
                    onClick={() => void navigate({ to: '/accounts/add' })}
                    className='mt-6 rounded-full px-6'
                  >
                    Add First Account
                  </Button>
                </section>
              ) : null}

              <section className='space-y-4'>
                {providerGroups.map((group) => (
                  <div key={group.key} className='dashboard-panel overflow-hidden rounded-3xl'>
                    <div className='border-border flex items-center justify-between gap-3 border-b p-5'>
                      <div>
                        <h3 className='text-lg font-semibold'>{group.label}</h3>
                        <p className='text-muted-foreground mt-1 text-sm'>
                          {group.items.length} account{group.items.length === 1 ? '' : 's'}
                        </p>
                      </div>
                      <Badge variant='outline' className='rounded-full px-3 py-1 text-xs'>
                        {group.key}
                      </Badge>
                    </div>

                    <div className='divide-border divide-y'>
                      {group.items.map((item) => (
                        <div
                          key={item.id}
                          className='grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_9rem_8rem_auto] lg:items-center'
                        >
                          <div className='min-w-0'>
                            <p className='truncate font-medium'>{item.id}</p>
                            <p className='text-muted-foreground mt-1 text-xs'>
                              Updated {new Date(item.updated_at).toLocaleString()}
                            </p>
                          </div>
                          <Badge
                            variant='outline'
                            className={`w-fit rounded-full px-2.5 py-1 text-xs ${statusTone(item.status)}`}
                          >
                            {item.status}
                          </Badge>
                          <p className='text-muted-foreground text-sm'>{item.provider_key}</p>
                          <Button
                            type='button'
                            variant='outline'
                            size='icon'
                            onClick={() => setDeleteTarget(item)}
                            className='h-9 w-9 rounded-xl'
                            title='Delete account'
                          >
                            <Trash2 className='size-4' />
                            <span className='sr-only'>Delete account</span>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            </div>
          </>
        ) : null}
      </QueryState>
    </PageShell>
  )
}
