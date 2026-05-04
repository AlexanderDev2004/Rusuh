export type StatusChip = [
  'active' | 'refreshing' | 'pending' | 'error' | 'disabled' | 'unknown',
  number,
]

export type OverviewSummaryRow = {
  provider: string
  total: number
  active: number
  refreshing: number
  pending: number
  error: number
  disabled: number
  unknown: number
  chips: StatusChip[]
}

export type OverviewProviderCard = {
  name: string
  total: number
  active: boolean
}
