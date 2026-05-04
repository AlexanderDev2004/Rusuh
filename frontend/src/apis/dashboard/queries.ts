import { queryOptions, useQuery } from '@tanstack/react-query'

import { api } from './api'

export const queryKeys = {
  overview: ['dashboard', 'overview'] as const,
  accounts: ['dashboard', 'accounts'] as const,
  apiKeys: ['dashboard', 'api-keys'] as const,
  config: ['dashboard', 'config'] as const,
}

export const overviewQueryOptions = queryOptions({
  queryKey: queryKeys.overview,
  queryFn: api.overview,
})

export const accountsQueryOptions = queryOptions({
  queryKey: queryKeys.accounts,
  queryFn: api.accounts,
})

export const apiKeysQueryOptions = queryOptions({
  queryKey: queryKeys.apiKeys,
  queryFn: api.apiKeys,
})

export const configQueryOptions = queryOptions({
  queryKey: queryKeys.config,
  queryFn: api.config,
})

export function useOverviewQuery() {
  return useQuery(overviewQueryOptions)
}

export function useAccountsQuery() {
  return useQuery(accountsQueryOptions)
}

export function useApiKeysQuery() {
  return useQuery(apiKeysQueryOptions)
}

export function useConfigQuery() {
  return useQuery(configQueryOptions)
}
