import { createRoute, type AnyRootRoute } from '@tanstack/react-router'

import { apiKeysQueryOptions } from '@/apis/dashboard/queries'
import { ApiKeysPage } from '@/features/api-keys/ApiKeysPage'

export function createApiKeysRoute(rootRoute: AnyRootRoute) {
  return createRoute({
    getParentRoute: () => rootRoute,
    loader: ({ context }) => context.queryClient.ensureQueryData(apiKeysQueryOptions),
    path: '/api-keys',
    component: ApiKeysPage,
  })
}
