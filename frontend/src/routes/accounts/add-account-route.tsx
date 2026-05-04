import { createRoute, type AnyRootRoute } from '@tanstack/react-router'

import { AddAccountPage } from '@/features/accounts/add-account-page'

export function createAddAccountRoute(rootRoute: AnyRootRoute) {
  return createRoute({
    getParentRoute: () => rootRoute,
    path: '/accounts/add',
    component: AddAccountPage,
  })
}
