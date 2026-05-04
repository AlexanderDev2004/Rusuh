import { createRoute, type AnyRootRoute } from '@tanstack/react-router'

import { OverviewPage } from '@/features/overview/overview-page'

export function createOverviewRoute(rootRoute: AnyRootRoute) {
  return createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: OverviewPage,
  })
}
