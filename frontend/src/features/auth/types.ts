export type ManagementAuthState = {
  secret: string
  isUnlocked: boolean
  initialized: boolean
  init: () => void
  setSecret: (value: string, persist?: boolean) => void
  clearSecret: () => void
}

export type ManagementAuthFormProps = {
  onUnlock: (secret: string, persist: boolean) => void
}
