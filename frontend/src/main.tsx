import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { StrictMode, useEffect, useMemo } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import { createAppQueryClient } from '@/app/query_client'
import { useThemeStore } from '@/app/theme'
import { Toaster } from '@/components/ui/Sonner'
import { useManagementAuth } from '@/features/auth/AuthGate'
import { useManagementAuthStore } from '@/features/auth/store'
import { createAppRouter } from '@/routes'
function AppProviders() {
  const { clearSecret } = useManagementAuth()
  const initAuth = useManagementAuthStore((state) => state.init)
  const queryClient = useMemo(() => createAppQueryClient(clearSecret), [clearSecret])
  const router = useMemo(() => createAppRouter(queryClient), [queryClient])
  const initTheme = useThemeStore((state) => state.initTheme)

  useEffect(() => {
    initAuth()
    initTheme()
  }, [initAuth, initTheme])
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  )
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders />
  </StrictMode>,
)
