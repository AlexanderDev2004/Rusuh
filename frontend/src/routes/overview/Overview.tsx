import { createRoute, type AnyRootRoute } from '@tanstack/react-router'

import { overviewQueryOptions } from '@/apis/dashboard/queries'
import { OverviewPage } from '@/features/overview/OverviewPage'

export function createOverviewRoute(rootRoute: AnyRootRoute) {
  return createRoute({
    getParentRoute: () => rootRoute,
    loader: ({ context }) => context.queryClient.ensureQueryData(overviewQueryOptions),
    path: '/',
    component: OverviewPage,
  })
}
