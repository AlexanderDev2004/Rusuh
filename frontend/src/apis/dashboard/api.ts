import type {
  DashboardAccountsPayload,
  DashboardApiKeysPayload,
  DashboardConfigPayload,
  DashboardHealth,
  DashboardOverview,
} from './types'

async function dashboard<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`Dashboard request failed: ${response.status} ${response.statusText}`)
  }

  return (await response.json()) as T
}

export const api = {
  health: () => dashboard<DashboardHealth>('/dashboard/health'),
  overview: () => dashboard<DashboardOverview>('/dashboard/overview'),
  accounts: () => dashboard<DashboardAccountsPayload>('/dashboard/accounts'),
  apiKeys: () => dashboard<DashboardApiKeysPayload>('/dashboard/api-keys'),
  config: () => dashboard<DashboardConfigPayload>('/dashboard/config'),
}
