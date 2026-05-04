import { Outlet } from '@tanstack/react-router'

import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { ManagementAuthGate } from '@/features/auth/AuthGate'

export function RootRouteComponent() {
  return (
    <ManagementAuthGate>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ManagementAuthGate>
  )
}
