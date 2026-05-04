import type { QueryClient } from '@tanstack/react-query'
import { createRootRoute, createRouter } from '@tanstack/react-router'

import { createAccountsRoute } from './accounts/Accounts'
import { createAddAccountRoute } from './accounts/AddAccount'
import { createApiKeysRoute } from './api-keys/ApiKeys'
import { createConfigRoute } from './config/Config'
import { createOverviewRoute } from './overview/Overview'
import { RootRouteComponent } from './RootRoute'

type RouterContext = {
  queryClient: QueryClient
}

const rootRoute = createRootRoute<RouterContext>({
  component: RootRouteComponent,
})

const overviewRoute = createOverviewRoute(rootRoute)
const accountsRoute = createAccountsRoute(rootRoute)
const addAccountRoute = createAddAccountRoute(rootRoute)
const apiKeysRoute = createApiKeysRoute(rootRoute)
const configRoute = createConfigRoute(rootRoute)

const routeTree = rootRoute.addChildren([
  overviewRoute,
  addAccountRoute,
  accountsRoute,
  apiKeysRoute,
  configRoute,
])

export function createAppRouter(queryClient: QueryClient) {
  return createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: 'intent',
    defaultPreloadStaleTime: 0,
    defaultPendingMinMs: 0,
  })
}

export const router = createAppRouter({} as QueryClient)

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
