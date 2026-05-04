import type { ManagementAuthFile } from '../../lib/management-auth-files'

export type ProviderGroup = {
  key: string
  label: string
  items: ManagementAuthFile[]
}
