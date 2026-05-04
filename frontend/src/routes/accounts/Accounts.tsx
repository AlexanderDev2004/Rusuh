import { createRoute, type AnyRootRoute } from '@tanstack/react-router'

import { accountsQueryOptions } from '@/apis/dashboard/queries'
import { AccountsPage } from '@/features/accounts/AccountsPage'

export function createAccountsRoute(rootRoute: AnyRootRoute) {
  return createRoute({
    getParentRoute: () => rootRoute,
    loader: ({ context }) => context.queryClient.ensureQueryData(accountsQueryOptions),
    path: '/accounts',
    component: AccountsPage,
  })
}
