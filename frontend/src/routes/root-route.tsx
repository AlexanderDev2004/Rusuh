import { Outlet } from '@tanstack/react-router'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ManagementAuthGate } from '@/features/management/management-auth'

export function RootRouteComponent() {
  return (
    <ManagementAuthGate>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ManagementAuthGate>
  )
}
