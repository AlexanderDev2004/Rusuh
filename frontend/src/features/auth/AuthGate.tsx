import type { PropsWithChildren } from 'react'

import { ManagementAuthForm } from './components/ManagementAuthForm'
import { useManagementAuthStore } from './store'

export function useManagementAuth() {
  const secret = useManagementAuthStore((state) => state.secret)
  const isUnlocked = useManagementAuthStore((state) => state.isUnlocked)
  const setSecret = useManagementAuthStore((state) => state.setSecret)
  const clearSecret = useManagementAuthStore((state) => state.clearSecret)

  return {
    secret,
    isUnlocked,
    setSecret,
    clearSecret,
  }
}

export function ManagementAuthGate({ children }: PropsWithChildren) {
  const { clearSecret, isUnlocked, setSecret } = useManagementAuth()

  if (isUnlocked) {
    return <>{children}</>
  }

  return (
    <ManagementAuthForm
      onUnlock={(secret, persist) => {
        clearSecret()
        setSecret(secret, persist)
      }}
    />
  )
}
