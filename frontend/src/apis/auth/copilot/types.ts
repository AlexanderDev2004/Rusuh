export type CopilotModelsResponse = {
  account: string
  provider_key: 'github-copilot'
  models: string[]
}

export type FetchCopilotModelsInput = {
  name: string
}
