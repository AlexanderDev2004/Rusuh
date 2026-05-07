import { useState } from 'react'

import { useStartOAuthMutation } from '@/apis/auth/oauth/api'
import { toastError, toastSuccess } from '@/components/feedback/toast'

import { formatOauthExpiryHint } from '../lib/oauth'
import type { AddAccountBaseModel } from './useAddAccountBase'

export interface UseCopilotModelProps {
  base: AddAccountBaseModel
}

export interface UseCopilotModelReturn {
  label: string
  setLabel: (label: string) => void
  userCode: string
  setUserCode: (code: string) => void
  verificationUri: string
  setVerificationUri: (uri: string) => void
  expiresIn: number | undefined
  setExpiresIn: (expiresIn: number | undefined) => void
  expiryHint: string | null
  startOauth: () => void
  isStartingOauth: boolean
}

export function useCopilotModel({ base }: UseCopilotModelProps): UseCopilotModelReturn {
  const startOAuth = useStartOAuthMutation()

  const [label, setLabel] = useState('')
  const [userCode, setUserCode] = useState('')
  const [verificationUri, setVerificationUri] = useState('')
  const [expiresIn, setExpiresIn] = useState<number | undefined>(undefined)

  const expiryHint = formatOauthExpiryHint(expiresIn)

  function startOauth() {
    startOAuth.mutate(
      {
        provider: 'github-copilot',
        label: label.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          base.setOauthStates((prev) => ({
            ...prev,
            'github-copilot': data.state,
          }))
          setUserCode(data.user_code ?? '')
          setVerificationUri(data.verification_uri ?? '')
          setExpiresIn(data.expires_in)
          toastSuccess('GitHub Copilot sign-in started', 'Open GitHub and enter the device code.')
        },
        onError: (error) => {
          toastError('Could not start GitHub Copilot sign-in', error.message)
        },
      },
    )
  }

  return {
    label,
    setLabel,
    userCode,
    setUserCode,
    verificationUri,
    setVerificationUri,
    expiresIn,
    setExpiresIn,
    expiryHint,
    startOauth,
    isStartingOauth: startOAuth.isPending,
  }
}

export type CopilotModel = ReturnType<typeof useCopilotModel>