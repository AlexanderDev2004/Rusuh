import { useEffect, useRef, useState } from 'react'

import { useOAuthStatusQuery } from '@/apis/auth/oauth/api'
import { useZedLoginStatusQuery } from '@/apis/auth/zed/api'
import { toastError, toastSuccess } from '@/components/feedback/toast'
import { buildOAuthTerminalFeedback } from '@/features/accounts/lib/feedback'

import type { AddAccountOauthProvider, TrackedOauthStates } from '../types'

const MAX_LABEL_LENGTH = 200
const MAX_UPLOAD_NAME_LENGTH = 200
const MAX_UPLOAD_BODY_LENGTH = 20000
const MAX_UPLOAD_FILE_SIZE = 1024 * 1024

function useProviderOauthStatus(state: string | undefined) {
  return useOAuthStatusQuery(state ?? null, Boolean(state))
}

export const ACCOUNT_LIMITS = {
  maxLabelLength: MAX_LABEL_LENGTH,
  maxUploadNameLength: MAX_UPLOAD_NAME_LENGTH,
  maxUploadBodyLength: MAX_UPLOAD_BODY_LENGTH,
  maxUploadFileSize: MAX_UPLOAD_FILE_SIZE,
}

export const TRACKED_OAUTH_PROVIDERS: Array<Exclude<AddAccountOauthProvider, 'zed'>> = [
  'kiro',
  'antigravity',
  'codex',
  'github-copilot',
]

export interface UseAddAccountBaseReturn {
  limits: typeof ACCOUNT_LIMITS
  provider: AddAccountOauthProvider
  setProvider: (provider: AddAccountOauthProvider) => void
  oauthStates: TrackedOauthStates
  setOauthStates: React.Dispatch<React.SetStateAction<TrackedOauthStates>>
  activeOauthState: string | null
  activeOauthStatusSummary: 'idle' | 'wait' | 'waiting' | 'ok' | 'error'
  activeOauthStatusData: {
    status?: 'wait' | 'ok' | 'error'
    error?: string
  } | null
}

export function useAddAccountBase() {
  const [provider, setProvider] = useState<AddAccountOauthProvider>('kiro')
  const [oauthStates, setOauthStates] = useState<TrackedOauthStates>({})

  const [zedSessionId, setZedSessionId] = useState<string | null>(null)
  const zedLoginStatus = useZedLoginStatusQuery(zedSessionId, Boolean(zedSessionId))

  const kiroOauthStatus = useProviderOauthStatus(oauthStates.kiro)
  const antigravityOauthStatus = useProviderOauthStatus(oauthStates.antigravity)
  const codexOauthStatus = useProviderOauthStatus(oauthStates.codex)
  const copilotOauthStatus = useProviderOauthStatus(oauthStates['github-copilot'])

  const oauthStatusByProvider = {
    kiro: kiroOauthStatus,
    antigravity: antigravityOauthStatus,
    codex: codexOauthStatus,
    'github-copilot': copilotOauthStatus,
  } as const

  const activeOauthState = provider === 'zed' ? zedSessionId : (oauthStates[provider] ?? null)
  const activeOauthStatus = provider === 'zed' ? null : oauthStatusByProvider[provider]
  const activeOauthStatusData = activeOauthStatus?.data
  const activeOauthStatusSummary =
    provider === 'zed'
      ? (zedLoginStatus.data?.status ?? (zedLoginStatus.isFetching ? 'waiting' : 'idle'))
      : activeOauthState
        ? (activeOauthStatusData?.status ?? (activeOauthStatus?.isFetching ? 'wait' : 'idle'))
        : 'idle'

  const lastNotifiedOauthStates = useRef<Partial<Record<AddAccountOauthProvider, string>>>({})
  const lastNotifiedZedSessionId = useRef<string | null>(null)

  useEffect(() => {
    const providerStatuses = {
      kiro: {
        status: kiroOauthStatus.data?.status,
        error: kiroOauthStatus.data?.error,
      },
      antigravity: {
        status: antigravityOauthStatus.data?.status,
        error: antigravityOauthStatus.data?.error,
      },
      codex: {
        status: codexOauthStatus.data?.status,
        error: codexOauthStatus.data?.error,
      },
      'github-copilot': {
        status: copilotOauthStatus.data?.status,
        error: copilotOauthStatus.data?.error,
      },
    } as const

    for (const trackedProvider of TRACKED_OAUTH_PROVIDERS) {
      const trackedState = oauthStates[trackedProvider]
      const trackedStatus = providerStatuses[trackedProvider].status
      const trackedError = providerStatuses[trackedProvider].error

      if (!trackedState || !trackedStatus || trackedStatus === 'wait') {
        continue
      }

      if (lastNotifiedOauthStates.current[trackedProvider] === trackedState) {
        continue
      }

      const feedback = buildOAuthTerminalFeedback(trackedStatus, trackedError)
      if (!feedback) {
        continue
      }

      if (feedback.type === 'success') {
        toastSuccess(feedback.title, feedback.detail)
      } else {
        toastError(feedback.title, feedback.detail)
      }

      lastNotifiedOauthStates.current[trackedProvider] = trackedState
    }
  }, [
    oauthStates,
    kiroOauthStatus.data?.status,
    kiroOauthStatus.data?.error,
    antigravityOauthStatus.data?.status,
    antigravityOauthStatus.data?.error,
    codexOauthStatus.data?.status,
    codexOauthStatus.data?.error,
    copilotOauthStatus.data?.status,
    copilotOauthStatus.data?.error,
  ])

  useEffect(() => {
    if (!zedSessionId || !zedLoginStatus.data?.status || zedLoginStatus.data.status === 'waiting') {
      return
    }

    if (lastNotifiedZedSessionId.current === zedSessionId) {
      return
    }

    toastSuccess('Zed login complete', 'Account connected. Open Accounts to review it.')
    lastNotifiedZedSessionId.current = zedSessionId
  }, [zedSessionId, zedLoginStatus.data?.status])

  return {
    limits: ACCOUNT_LIMITS,
    provider,
    setProvider,
    oauthStates,
    setOauthStates,
    activeOauthState,
    activeOauthStatusSummary,
    activeOauthStatusData,
    zedSessionId,
    setZedSessionId,
    zedLoginStatus,
  }
}

export type AddAccountBaseModel = ReturnType<typeof useAddAccountBase>
