import { Copy } from 'lucide-react'
import { useMemo, useState } from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import {
  stackoverflowDark,
  stackoverflowLight,
} from 'react-syntax-highlighter/dist/esm/styles/hljs'

import { useConfigQuery } from '@/apis/dashboard/queries'
import { useThemeStore } from '@/app/theme'
import { toastSuccess } from '@/components/feedback/toast'
import { PageShell } from '@/components/layout/PageShell'
import { QueryState } from '@/components/shared/QueryState'
import { statusTone } from '@/components/shared/status_tone'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

import type { BoolPillProps, ConfigFormatMode } from './types'

function BoolPill({ value }: BoolPillProps) {
  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs ${statusTone(value ? 'active' : 'disabled')}`}
    >
      {value ? 'enabled' : 'disabled'}
    </span>
  )
}

const CODE_THEME_OVERRIDES = {
  background: 'transparent',
  padding: 0,
  margin: 0,
  fontSize: '0.875rem',
  lineHeight: '1.6',
} as const

function toYamlLines(value: unknown, indent = 0): string[] {
  const prefix = '  '.repeat(indent)

  if (Array.isArray(value)) {
    if (value.length === 0) return [`${prefix}[]`]

    return value.flatMap((item) => {
      if (item && typeof item === 'object') {
        const nested = toYamlLines(item, indent + 1)
        const [first, ...rest] = nested
        return [`${prefix}- ${first.trimStart()}`, ...rest]
      }

      return [`${prefix}- ${String(item)}`]
    })
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
    if (entries.length === 0) return [`${prefix}{}`]

    return entries.flatMap(([key, nested]) => {
      if (nested && typeof nested === 'object') {
        return [`${prefix}${key}:`, ...toYamlLines(nested, indent + 1)]
      }

      return [`${prefix}${key}: ${String(nested)}`]
    })
  }

  return [`${prefix}${String(value)}`]
}

async function copyRawConfig(value: string) {
  await navigator.clipboard.writeText(value)
  toastSuccess('Config copied', 'Raw config copied to clipboard.')
}

export function ConfigPage() {
  const config = useConfigQuery()
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme)
  const [format, setFormat] = useState<ConfigFormatMode>('structured')

  const rawJson = useMemo(() => {
    if (!config.data) return ''
    return JSON.stringify(config.data, null, 2)
  }, [config.data])

  const rawYaml = useMemo(() => {
    if (!config.data) return ''
    return toYamlLines(config.data).join('\n')
  }, [config.data])

  const providerNames = config.data?.provider_names ?? []
  const hasProviders = providerNames.length > 0
  const codeTheme = resolvedTheme === 'dark' ? stackoverflowDark : stackoverflowLight

  return (
    <PageShell
      eyebrow='Config'
      title='Runtime Configuration'
      description='A structured config board with raw JSON/YAML available when needed.'
      actions={
        <div className='dashboard-panel grid grid-cols-3 gap-1 rounded-2xl p-1'>
          {(['structured', 'json', 'yaml'] as const).map((value) => (
            <Button
              key={value}
              type='button'
              variant={format === value ? 'default' : 'ghost'}
              onClick={() => setFormat(value)}
              className='h-10 rounded-xl px-4 capitalize'
            >
              {value}
            </Button>
          ))}
        </div>
      }
    >
      <QueryState
        isLoading={config.isLoading}
        isError={config.isError}
        error={config.error as Error | null}
      >
        {config.data ? (
          format === 'structured' ? (
            <div className='space-y-6'>
              <section className='dashboard-panel rounded-3xl p-5 md:p-6'>
                <div className='grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem] xl:items-start'>
                  <div>
                    <p className='text-muted-foreground text-xs tracking-[0.2em] uppercase'>
                      Runtime Endpoint
                    </p>
                    <h3 className='mt-2 text-2xl font-semibold tracking-[-0.03em] break-all'>
                      {config.data.listen_addr}
                    </h3>
                    <p className='text-muted-foreground mt-2 text-sm leading-6'>
                      {config.data.host || 'All interfaces'} · port {config.data.port} ·{' '}
                      {config.data.routing_strategy}
                    </p>
                  </div>
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='border-border bg-muted/25 rounded-2xl border p-4'>
                      <p className='text-muted-foreground text-xs'>Providers</p>
                      <p className='mt-2 text-3xl font-semibold'>{config.data.provider_count}</p>
                    </div>
                    <div className='border-border bg-muted/25 rounded-2xl border p-4'>
                      <p className='text-muted-foreground text-xs'>API keys</p>
                      <p className='mt-2 text-3xl font-semibold'>{config.data.api_key_count}</p>
                    </div>
                  </div>
                </div>
              </section>

              <section className='grid gap-6 xl:grid-cols-[0.95fr_1.05fr]'>
                <div className='dashboard-panel overflow-hidden rounded-3xl'>
                  <div className='border-border border-b p-5'>
                    <h3 className='text-lg font-semibold'>Runtime Flags</h3>
                    <p className='text-muted-foreground mt-1 text-sm'>
                      Management and retry behavior.
                    </p>
                  </div>
                  <dl className='divide-border divide-y text-sm'>
                    {[
                      ['Auth dir', config.data.auth_dir || '(default)'],
                      ['Request retry', config.data.request_retry],
                      ['OAuth alias rules', `${config.data.oauth_alias_count}`],
                    ].map(([label, value]) => (
                      <div key={label} className='flex items-center justify-between gap-4 p-4'>
                        <dt className='text-muted-foreground'>{label}</dt>
                        <dd className='text-right font-medium break-all'>{value}</dd>
                      </div>
                    ))}
                    <div className='flex items-center justify-between gap-4 p-4'>
                      <dt className='text-muted-foreground'>Debug</dt>
                      <dd>
                        <BoolPill value={config.data.debug} />
                      </dd>
                    </div>
                    <div className='flex items-center justify-between gap-4 p-4'>
                      <dt className='text-muted-foreground'>Management API</dt>
                      <dd>
                        <BoolPill value={config.data.management.enabled} />
                      </dd>
                    </div>
                    <div className='flex items-center justify-between gap-4 p-4'>
                      <dt className='text-muted-foreground'>Remote management</dt>
                      <dd>
                        <BoolPill value={config.data.management.allow_remote} />
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className='space-y-4'>
                  <div className='dashboard-panel rounded-3xl p-5'>
                    <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                      <div>
                        <h3 className='text-lg font-semibold'>Configured Providers</h3>
                        <p className='text-muted-foreground mt-1 text-sm'>
                          Providers currently registered in runtime config.
                        </p>
                      </div>
                      <Badge variant='outline' className='w-fit rounded-full px-3 py-1 text-xs'>
                        {hasProviders ? `${providerNames.length} configured` : 'No providers'}
                      </Badge>
                    </div>
                    {hasProviders ? (
                      <div className='mt-4 flex flex-wrap gap-2'>
                        {providerNames.map((name) => (
                          <Badge key={name} variant='outline' className='rounded-full px-3 py-1'>
                            {name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className='text-muted-foreground mt-4 text-sm'>
                        Add an account first, then return here to inspect configured providers.
                      </p>
                    )}
                  </div>

                  <div className='dashboard-panel overflow-hidden rounded-3xl'>
                    <div className='border-border border-b p-5'>
                      <h3 className='text-lg font-semibold'>Key Buckets</h3>
                    </div>
                    <div className='divide-border grid sm:grid-cols-2 sm:divide-x'>
                      {[
                        ['Gemini', config.data.gemini_api_keys.length],
                        ['Codex', config.data.codex_api_keys.length],
                        ['Claude', config.data.claude_api_keys.length],
                        ['OpenAI-compatible', config.data.openai_compat.length],
                      ].map(([label, value]) => (
                        <div key={label} className='border-border border-b p-4 last:border-b-0'>
                          <p className='text-muted-foreground text-sm'>{label}</p>
                          <p className='mt-2 text-2xl font-semibold'>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <Card className='dashboard-panel rounded-3xl'>
              <CardContent className='px-5 py-3 md:px-6 md:py-3'>
                <div className='mb-1.5 flex items-center justify-between gap-3'>
                  <p className='text-muted-foreground text-sm'>
                    Raw {format.toUpperCase()} view of the current runtime snapshot.
                  </p>
                  <Button
                    type='button'
                    variant='outline'
                    size='icon'
                    onClick={() => void copyRawConfig(format === 'json' ? rawJson : rawYaml)}
                    className='h-9 w-9 rounded-xl'
                    title={`Copy ${format.toUpperCase()}`}
                  >
                    <Copy className='size-4' />
                    <span className='sr-only'>Copy {format.toUpperCase()}</span>
                  </Button>
                </div>
                <div className='border-border bg-muted/20 max-h-[min(65vh,44rem)] overflow-auto rounded-2xl border px-4 py-3'>
                  <SyntaxHighlighter
                    language={format}
                    style={codeTheme}
                    customStyle={CODE_THEME_OVERRIDES}
                    codeTagProps={{
                      className: 'font-mono',
                    }}
                    wrapLongLines
                    showLineNumbers
                    lineNumberStyle={{
                      minWidth: '2.25rem',
                      paddingRight: '0.75rem',
                      color: 'hsl(var(--muted-foreground))',
                      opacity: 0.55,
                      textAlign: 'right',
                    }}
                  >
                    {format === 'json' ? rawJson : rawYaml}
                  </SyntaxHighlighter>
                </div>
              </CardContent>
            </Card>
          )
        ) : null}
      </QueryState>
    </PageShell>
  )
}
