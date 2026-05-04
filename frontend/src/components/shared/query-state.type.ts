import type { ReactNode } from 'react'

export type QueryStateProps = {
  isLoading: boolean
  isError: boolean
  error: Error | null
  children: ReactNode
}
