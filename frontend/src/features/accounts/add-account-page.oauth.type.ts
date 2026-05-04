export type AddAccountOauthProvider = 'kiro' | 'antigravity' | 'codex' | 'zed' | 'github-copilot'

export type TrackedOauthStates = Partial<Record<AddAccountOauthProvider, string>>
