import { useState } from 'react'

import {
  useImportKiroMutation,
  useImportKiroSocialMutation,
  useStartKiroBuilderIdMutation,
} from '@/apis/auth/kiro/api'
import { toastError, toastSuccess } from '@/components/feedback/toast'

import type { KiroImportMode } from '../types'
import type { AddAccountBaseModel } from './useAddAccountBase'

export interface UseKiroModelProps {
  base: AddAccountBaseModel
}

export interface UseKiroModelReturn {
  label: string
  setLabel: (label: string) => void
  importMode: KiroImportMode
  setImportMode: (mode: KiroImportMode) => void
  importJson: string
  setImportJson: (json: string) => void
  accessToken: string
  setAccessToken: (token: string) => void
  refreshToken: string
  setRefreshToken: (token: string) => void
  expiresAt: string
  setExpiresAt: (expiresAt: string) => void
  clientId: string
  setClientId: (clientId: string) => void
  clientSecret: string
  setClientSecret: (clientSecret: string) => void
  profileArn: string
  setProfileArn: (profileArn: string) => void
  provider: string
  setProvider: (provider: string) => void
  region: string
  setRegion: (region: string) => void
  startUrl: string
  setStartUrl: (url: string) => void
  email: string
  setEmail: (email: string) => void
  socialRefreshToken: string
  setSocialRefreshToken: (token: string) => void
  startBuilderFlow: () => void
  submitImport: () => void
  submitSocialImport: () => void
  isStartingBuilderId: boolean
  isImporting: boolean
  isImportingSocial: boolean
}

export function useKiroModel({ base }: UseKiroModelProps): UseKiroModelReturn {
  const startKiroBuilderId = useStartKiroBuilderIdMutation()
  const importKiro = useImportKiroMutation()
  const importKiroSocial = useImportKiroSocialMutation()

  const [label, setLabel] = useState('')
  const [importMode, setImportMode] = useState<KiroImportMode>('structured')
  const [importJson, setImportJson] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [refreshToken, setRefreshToken] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [profileArn, setProfileArn] = useState('')
  const [provider, setProvider] = useState('AWS')
  const [region, setRegion] = useState('us-east-1')
  const [startUrl, setStartUrl] = useState('https://view.awsapps.com/start')
  const [email, setEmail] = useState('')
  const [socialRefreshToken, setSocialRefreshToken] = useState('')

  function startBuilderFlow() {
    startKiroBuilderId.mutate(
      { label: label.trim() || undefined },
      {
        onSuccess: (data) => {
          base.setOauthStates((prev) => ({ ...prev, kiro: data.session_id }))
          toastSuccess('Kiro sign-in started', 'Finish the flow, then open Accounts.')
          window.open(data.auth_url, '_blank', 'noopener,noreferrer')
        },
        onError: (error) => {
          toastError('Could not start Kiro sign-in', error.message)
        },
      },
    )
  }

  function submitStructuredImport() {
    importKiro.mutate(
      {
        access_token: accessToken.trim(),
        refresh_token: refreshToken.trim(),
        expires_at: expiresAt.trim(),
        client_id: clientId.trim(),
        client_secret: clientSecret.trim(),
        profile_arn: profileArn.trim(),
        auth_method: 'import',
        provider: provider.trim() || 'AWS',
        region: region.trim() || 'us-east-1',
        start_url: startUrl.trim(),
        email: email.trim(),
        label: label.trim(),
      },
      {
        onSuccess: () => {
          toastSuccess('Kiro account added', 'Open Accounts to review it.')
        },
        onError: (error) => {
          toastError('Could not add the Kiro account', error.message)
        },
      },
    )
  }

  function submitJsonImport() {
    const parsed = JSON.parse(importJson) as Record<string, unknown>
    importKiro.mutate(
      {
        access_token: String(parsed.access_token ?? ''),
        refresh_token: String(parsed.refresh_token ?? ''),
        expires_at: String(parsed.expires_at ?? ''),
        client_id: String(parsed.client_id ?? ''),
        client_secret: String(parsed.client_secret ?? ''),
        profile_arn: String(parsed.profile_arn ?? ''),
        auth_method: typeof parsed.auth_method === 'string' ? parsed.auth_method : 'import',
        provider: typeof parsed.provider === 'string' ? parsed.provider : 'AWS',
        region: typeof parsed.region === 'string' ? parsed.region : 'us-east-1',
        start_url: typeof parsed.start_url === 'string' ? parsed.start_url : '',
        email: typeof parsed.email === 'string' ? parsed.email : '',
        label: label.trim(),
      },
      {
        onSuccess: () => {
          toastSuccess('Kiro account added', 'Open Accounts to review it.')
        },
        onError: (error) => {
          toastError('Could not add the Kiro account', error.message)
        },
      },
    )
  }

  function submitImport() {
    try {
      if (importMode === 'json') {
        submitJsonImport()
        return
      }
      submitStructuredImport()
    } catch (error) {
      toastError(
        'Could not read the JSON',
        error instanceof Error ? error.message : 'Check the JSON and try again.',
      )
    }
  }

  function submitSocialImport() {
    importKiroSocial.mutate(
      {
        refresh_token: socialRefreshToken.trim(),
        label: label.trim() || undefined,
      },
      {
        onSuccess: () => {
          toastSuccess('Kiro account added', 'Open Accounts to review it.')
        },
        onError: (error) => {
          toastError('Could not add the Kiro account', error.message)
        },
      },
    )
  }

  return {
    label,
    setLabel,
    importMode,
    setImportMode,
    importJson,
    setImportJson,
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    expiresAt,
    setExpiresAt,
    clientId,
    setClientId,
    clientSecret,
    setClientSecret,
    profileArn,
    setProfileArn,
    provider,
    setProvider,
    region,
    setRegion,
    startUrl,
    setStartUrl,
    email,
    setEmail,
    socialRefreshToken,
    setSocialRefreshToken,
    startBuilderFlow,
    submitImport,
    submitSocialImport,
    isStartingBuilderId: startKiroBuilderId.isPending,
    isImporting: importKiro.isPending,
    isImportingSocial: importKiroSocial.isPending,
  }
}

export type KiroModel = ReturnType<typeof useKiroModel>
