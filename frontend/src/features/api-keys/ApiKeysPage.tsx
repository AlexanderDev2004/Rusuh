import { Trash2 } from 'lucide-react'

import { useApiKeysQuery } from '@/apis/dashboard/queries'
import { PageShell } from '@/components/layout/PageShell'
import { QueryState } from '@/components/shared/QueryState'
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
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

import { ApiKeyForm } from './components/ApiKeyForm'
import { ApiKeysTable } from './components/ApiKeysTable'
import { useApiKeyActions } from './hooks/use_actions'

export function ApiKeysPage() {
  const apiKeys = useApiKeysQuery()
  const { appendKey, clearKeys, deleteKey, generateKey, mutationError, replaceKey } =
    useApiKeyActions()
  const total = apiKeys.data?.total ?? 0

  return (
    <PageShell
      eyebrow='API Keys'
      title='API Keys'
      description='A split workspace for generating, rotating, and clearing client access keys.'
      actions={
        <div className='flex flex-col gap-3 sm:flex-row sm:flex-wrap'>
          <Button
            type='button'
            onClick={() => generateKey.mutate()}
            disabled={generateKey.isPending}
            className='h-11 rounded-full px-5'
          >
            {generateKey.isPending ? 'Generating…' : 'Generate key'}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type='button'
                variant='destructive'
                disabled={clearKeys.isPending || !apiKeys.data || total === 0}
                className='h-11 rounded-full px-5'
              >
                <Trash2 className='size-4' />
                {clearKeys.isPending ? 'Clearing…' : 'Clear all'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className='rounded-3xl'>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <Trash2 className='size-5' />
                </AlertDialogMedia>
                <AlertDialogTitle>Clear all API keys?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes every configured API key. Connected clients will stop authenticating.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className='rounded-full px-5'>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  variant='destructive'
                  className='rounded-full px-5'
                  onClick={() => clearKeys.mutate()}
                >
                  Clear all
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      }
    >
      <QueryState
        isLoading={apiKeys.isLoading}
        isError={apiKeys.isError}
        error={apiKeys.error as Error | null}
      >
        {apiKeys.data ? (
          <div className='grid gap-6 xl:grid-cols-[0.85fr_1.15fr]'>
            <aside className='space-y-4'>
              <section className='dashboard-panel rounded-3xl p-5'>
                <p className='text-muted-foreground text-xs tracking-[0.2em] uppercase'>
                  Key Inventory
                </p>
                <p className='mt-2 text-4xl font-semibold tracking-[-0.04em]'>{total}</p>
                <p className='text-muted-foreground mt-2 text-sm leading-6'>
                  {apiKeys.data.generated_only
                    ? 'Current keys are session-generated only.'
                    : 'Current keys are config-backed or mixed.'}
                </p>
                <div className='mt-4 flex flex-wrap gap-2'>
                  <Badge variant='outline' className='rounded-full px-3 py-1 text-xs'>
                    {total > 0 ? 'Ready' : 'Empty'}
                  </Badge>
                  <Badge variant='outline' className='rounded-full px-3 py-1 text-xs'>
                    Rotate anytime
                  </Badge>
                </div>
              </section>

              {mutationError ? (
                <section className='border-destructive/30 bg-destructive/10 text-destructive rounded-3xl border p-4 text-sm'>
                  {mutationError.message}
                </section>
              ) : null}

              <ApiKeyForm isPending={appendKey.isPending} onSubmit={appendKey.mutate} />
            </aside>

            <ApiKeysTable
              items={apiKeys.data.items}
              deletePending={deleteKey.isPending}
              replacePending={replaceKey.isPending}
              onDelete={deleteKey.mutate}
              onReplace={replaceKey.mutate}
            />
          </div>
        ) : null}
      </QueryState>
    </PageShell>
  )
}
