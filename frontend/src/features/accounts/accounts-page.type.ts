import type { ManagementAuthFile } from '@/features/management/auth-files'

export type ProviderGroup = {
  key: string
  label: string
  items: ManagementAuthFile[]
}
