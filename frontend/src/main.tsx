import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import { createAppQueryClient } from './app/query-client'
import { useThemeStore } from './app/theme'
import { Toaster } from './components/ui/sonner'
import { ManagementAuthProvider, useManagementAuth } from './features/management/management-auth'
import { router } from './routes'
function AppProviders() {
  const { clearSecret } = useManagementAuth()
  const queryClient = createAppQueryClient(clearSecret)
  const initTheme = useThemeStore((state) => state.initTheme)

  useEffect(() => {
    initTheme()
  }, [initTheme])
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  )
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ManagementAuthProvider>
      <AppProviders />
    </ManagementAuthProvider>
  </StrictMode>,
)
