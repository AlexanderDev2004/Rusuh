import { createRoute, type AnyRootRoute } from '@tanstack/react-router'

import { AccountsPage } from '@/features/accounts/accounts-page'

export function createAccountsRoute(rootRoute: AnyRootRoute) {
  return createRoute({
    getParentRoute: () => rootRoute,
    path: '/accounts',
    component: AccountsPage,
  })
}
