import { z } from 'zod'

export const MAX_KEY_LENGTH = 400

export const apiKeyFormSchema = z.object({
  value: z.string().trim().min(1, 'Key label is required.').max(MAX_KEY_LENGTH),
})

export type ApiKeyFormValues = z.infer<typeof apiKeyFormSchema>

export type ReplaceApiKeyInput = {
  index: number
  value: string
}

export type ApiKeysResponse = {
  'api-keys': string[]
  generated?: string[]
}
