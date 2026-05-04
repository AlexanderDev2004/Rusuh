import { createRoute, type AnyRootRoute } from '@tanstack/react-router'

import { ConfigPage } from '@/features/config/config-page'

export function createConfigRoute(rootRoute: AnyRootRoute) {
  return createRoute({
    getParentRoute: () => rootRoute,
    path: '/config',
    component: ConfigPage,
  })
}
