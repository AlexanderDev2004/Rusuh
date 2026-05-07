import { useAddAccountBase } from './useAddAccountBase'
import { useAntigravityModel } from './useAntigravityModel'
import { useCodexModel } from './useCodexModel'
import { useCopilotModel } from './useCopilotModel'
import { useKiroModel } from './useKiroModel'
import { useManualModel } from './useManualModel'
import { useZedModel } from './useZedModel'

export function useAddAccountModel() {
  const base = useAddAccountBase()
  const kiro = useKiroModel({ base })
  const antigravity = useAntigravityModel({ base })
  const codex = useCodexModel({ base })
  const zed = useZedModel({ base })
  const copilot = useCopilotModel({ base })
  const manual = useManualModel()

  return {
    limits: base.limits,
    provider: base.provider,
    setProvider: base.setProvider,
    activeOauthState: base.activeOauthState,
    activeOauthStatusSummary: base.activeOauthStatusSummary,
    activeOauthStatusData: base.activeOauthStatusData,
    kiro,
    antigravity,
    codex,
    zed,
    copilot,
    manual,
  }
}

export type AddAccountModel = ReturnType<typeof useAddAccountModel>