import type { ManagementAuthFile } from '@/apis/auth/files/types'

export type AddAccountOauthProvider = 'kiro' | 'antigravity' | 'codex' | 'zed' | 'github-copilot'

export type TrackedOauthStates = Partial<Record<AddAccountOauthProvider, string>>

export type KiroImportMode = 'structured' | 'json'

export type ProviderGroup = {
  key: string
  label: string
  items: ManagementAuthFile[]
}
