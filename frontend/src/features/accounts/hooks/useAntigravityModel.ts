import { useState } from 'react'

import { useStartOAuthMutation, useSubmitOAuthCallbackMutation } from '@/apis/auth/oauth/api'
import { toastError, toastSuccess } from '@/components/feedback/toast'

import { resolveTrackedOauthSession } from '../lib/oauth'
import type { AddAccountBaseModel } from './useAddAccountBase'

export interface UseAntigravityModelProps {
  base: AddAccountBaseModel
}

export interface UseAntigravityModelReturn {
  label: string
  setLabel: (label: string) => void
  authUrl: string
  setAuthUrl: (url: string) => void
  callbackUrl: string
  setCallbackUrl: (url: string) => void
  startOauth: () => void
  submitCallback: () => void
  isStartingOauth: boolean
  isSubmittingCallback: boolean
}

export function useAntigravityModel({ base }: UseAntigravityModelProps): UseAntigravityModelReturn {
  const startOAuth = useStartOAuthMutation()
  const submitOAuthCallback = useSubmitOAuthCallbackMutation()

  const [label, setLabel] = useState('')
  const [authUrl, setAuthUrl] = useState('')
  const [callbackUrl, setCallbackUrl] = useState('')

  function startOauth() {
    startOAuth.mutate(
      {
        provider: 'antigravity',
        label: label.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          base.setOauthStates((prev) => ({
            ...prev,
            [data.provider as keyof typeof prev]: data.state,
          }))
          setAuthUrl(data.url ?? '')
          toastSuccess(
            'Antigravity OAuth link ready',
            'Open the link, login, then paste localhost callback URL below.',
          )
        },
        onError: (error) => {
          toastError('Could not start Antigravity sign-in', error.message)
        },
      },
    )
  }

  function submitCallback() {
    const trackedSession = resolveTrackedOauthSession('antigravity', callbackUrl, base.oauthStates)

    submitOAuthCallback.mutate(
      {
        provider: 'antigravity',
        redirectUrl: callbackUrl,
      },
      {
        onSuccess: () => {
          if (trackedSession) {
            base.setOauthStates((prev) => ({
              ...prev,
              [trackedSession.provider]: trackedSession.state,
            }))
          }
          toastSuccess('Callback submitted', 'Polling OAuth status...')
        },
        onError: (error) => {
          toastError('Could not submit callback URL', error.message)
        },
      },
    )
  }

  return {
    label,
    setLabel,
    authUrl,
    setAuthUrl,
    callbackUrl,
    setCallbackUrl,
    startOauth,
    submitCallback,
    isStartingOauth: startOAuth.isPending,
    isSubmittingCallback: submitOAuthCallback.isPending,
  }
}

export type AntigravityModel = ReturnType<typeof useAntigravityModel>
