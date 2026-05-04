import { createRoute, type AnyRootRoute } from '@tanstack/react-router'

import { ApiKeysPage } from '@/features/api-keys/api-keys-page'

export function createApiKeysRoute(rootRoute: AnyRootRoute) {
  return createRoute({
    getParentRoute: () => rootRoute,
    path: '/api-keys',
    component: ApiKeysPage,
  })
}
