import { useMemo, useState } from 'react'

import { useConfigQuery } from '@/apis/dashboard/queries'
import { useThemeStore } from '@/app/theme'
import { toastSuccess } from '@/components/feedback/toast'

import type { ConfigFormatMode } from '../types'

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

export function useConfigModel() {
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

  async function copyRawConfig(value: string) {
    await navigator.clipboard.writeText(value)
    toastSuccess('Config copied', 'Raw config copied to clipboard.')
  }

  return {
    config,
    format,
    setFormat,
    rawJson,
    rawYaml,
    providerNames,
    hasProviders,
    resolvedTheme,
    copyRawConfig,
    codeThemeOverrides: CODE_THEME_OVERRIDES,
  }
}

export type ConfigModel = ReturnType<typeof useConfigModel>
