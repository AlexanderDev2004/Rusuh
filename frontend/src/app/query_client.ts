import { QueryCache, QueryClient } from '@tanstack/react-query'

import { ManagementAuthError } from '@/apis/auth/errors'

export function createAppQueryClient(onManagementAuthError: () => void) {
  return new QueryClient({
    queryCache: new QueryCache({
      onError(error) {
        if (error instanceof ManagementAuthError) {
          onManagementAuthError()
        }
      },
    }),
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 5_000,
      },
    },
  })
}
