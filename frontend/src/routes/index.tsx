import { createRootRoute, createRouter } from '@tanstack/react-router'

import { createAccountsRoute } from './accounts/accounts-route'
import { createAddAccountRoute } from './accounts/add-account-route'
import { createApiKeysRoute } from './api-keys/api-keys-route'
import { createConfigRoute } from './config/config-route'
import { createOverviewRoute } from './overview/overview-route'
import { RootRouteComponent } from './root-route'

const rootRoute = createRootRoute({
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

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPendingMinMs: 0,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
