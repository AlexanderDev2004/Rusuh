import { useState } from 'react'

import { useStartZedLoginMutation } from '@/apis/auth/zed/api'
import type { ZedLoginStatusResponse } from '@/apis/auth/zed/types'
import { toastError, toastSuccess } from '@/components/feedback/toast'
import type { AddAccountBaseModel } from './useAddAccountBase'

export interface UseZedModelProps {
  base: AddAccountBaseModel
}

export interface UseZedModelReturn {
  label: string
  setLabel: (label: string) => void
  loginUrl: string
  setLoginUrl: (url: string) => void
  port: number | null
  setPort: (port: number | null) => void
  statusData: ZedLoginStatusResponse | undefined
  statusError: Error | null
  startLogin: () => void
  isStartingLogin: boolean
}

export function useZedModel({ base }: UseZedModelProps): UseZedModelReturn {
  const startZedLogin = useStartZedLoginMutation()

  const [label, setLabel] = useState('')
  const [loginUrl, setLoginUrl] = useState('')
  const [port, setPort] = useState<number | null>(null)

  function startLogin() {
    startZedLogin.mutate(
      { name: label.trim() || undefined },
      {
        onSuccess: (data) => {
          base.setZedSessionId(data.session_id)
          setLoginUrl(data.login_url)
          setPort(data.port)
          toastSuccess('Zed login started', 'Open the login link and finish the native-app flow.')
          window.open(data.login_url, '_blank', 'noopener,noreferrer')
        },
        onError: (error) => {
          toastError('Could not start Zed sign-in', error.message)
        },
      },
    )
  }

  return {
    label,
    setLabel,
    loginUrl,
    setLoginUrl,
    port,
    setPort,
    statusData: base.zedLoginStatus.data,
    statusError: base.zedLoginStatus.error,
    startLogin,
    isStartingLogin: startZedLogin.isPending,
  }
}

export type ZedModel = ReturnType<typeof useZedModel>