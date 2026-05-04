import { createRoute, type AnyRootRoute } from '@tanstack/react-router'

import { configQueryOptions } from '@/apis/dashboard/queries'
import { ConfigPage } from '@/features/config/ConfigPage'

export function createConfigRoute(rootRoute: AnyRootRoute) {
  return createRoute({
    getParentRoute: () => rootRoute,
    loader: ({ context }) => context.queryClient.ensureQueryData(configQueryOptions),
    path: '/config',
    component: ConfigPage,
  })
}
