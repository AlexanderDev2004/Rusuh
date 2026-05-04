import { Link, useRouterState } from '@tanstack/react-router'
import { LaptopMinimal, Moon, Sun } from 'lucide-react'
import { type PropsWithChildren, useEffect, useRef, useState } from 'react'

import { useOverviewQuery } from '@/api/dashboard-queries'
import { useThemeStore } from '@/app/theme'
import { cn } from '@/components/shared/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useManagementStatusQuery } from '@/features/management/management-api'
import { useManagementAuth } from '@/features/management/management-auth'

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/accounts', label: 'Accounts' },
  { to: '/api-keys', label: 'API Keys' },
  { to: '/config', label: 'Config' },
] as const

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: LaptopMinimal },
] as const

type ThemeMenuProps = {
  theme: 'light' | 'dark' | 'system'
  resolvedTheme: 'light' | 'dark'
  setTheme: (value: 'light' | 'dark' | 'system') => void
  align?: 'left' | 'right'
  direction?: 'up' | 'down'
}

function ThemeMenu({
  theme,
  resolvedTheme,
  setTheme,
  align = 'left',
  direction = 'down',
}: ThemeMenuProps) {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return

    const handlePointer = (event: PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('pointerdown', handlePointer)
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('pointerdown', handlePointer)
      window.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const ActiveIcon = theme === 'system' ? LaptopMinimal : theme === 'dark' ? Moon : Sun
  const menuPositionClass = align === 'right' ? 'right-0' : 'left-0'
  const menuDirectionClass = direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'
  const label = theme === 'system' ? `System (${resolvedTheme})` : theme

  return (
    <div ref={wrapperRef} className='relative'>
      <Button
        type='button'
        variant='outline'
        size='icon'
        onClick={() => setOpen((value) => !value)}
        aria-haspopup='menu'
        aria-expanded={open}
        className='dashboard-sidebar-pill h-10 w-10 rounded-full'
      >
        <ActiveIcon className='size-4' />
        <span className='sr-only'>Theme: {label}</span>
      </Button>
      {open ? (
        <div
          role='menu'
          className={cn(
            'dashboard-panel border-border/60 bg-background/95 absolute z-40 w-44 rounded-2xl border p-2 shadow-[0_22px_40px_rgba(6,8,20,0.45)] backdrop-blur',
            menuPositionClass,
            menuDirectionClass,
          )}
        >
          {themeOptions.map((option) => {
            const selected = option.value === theme
            const Icon = option.icon
            return (
              <button
                key={option.value}
                type='button'
                role='menuitem'
                onClick={() => {
                  setTheme(option.value)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition',
                  selected
                    ? 'bg-primary/90 text-white shadow-[0_12px_30px_rgba(12,16,40,0.35)]'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                )}
              >
                <span
                  className={cn(
                    'flex size-7 items-center justify-center rounded-full border',
                    selected
                      ? 'border-white/50 bg-white/15 text-white'
                      : 'border-border/60 bg-muted/40 text-foreground',
                  )}
                >
                  <Icon className='size-4' />
                </span>
                <span className='flex-1 text-left'>{option.label}</span>
                {selected ? <span className='text-xs'>●</span> : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export function DashboardLayout({ children }: PropsWithChildren<object>) {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const overview = useOverviewQuery()
  const managementStatus = useManagementStatusQuery()
  const { clearSecret } = useManagementAuth()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const theme = useThemeStore((state) => state.theme)
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme)
  const setTheme = useThemeStore((state) => state.setTheme)

  const providerCount = overview.data?.provider_names.length ?? 0
  return (
    <div className='dashboard-app bg-background text-foreground min-h-screen'>
      <div className='flex min-h-screen w-full gap-6 overflow-x-clip px-0 py-0'>
        <aside className='dashboard-sidebar hidden w-72 flex-col px-5 py-6 md:flex lg:w-80 lg:px-6 lg:py-7'>
          <div>
            <p className='text-muted-foreground/90 text-[0.7rem] font-medium tracking-[0.34em] uppercase'>
              Rusuh Dashboard
            </p>
            <h1 className='mt-3 text-[2rem] font-semibold tracking-[-0.045em] lg:text-[2.2rem]'>
              Control Center
            </h1>
          </div>
          <nav className='mt-10 space-y-2'>
            {navItems.map((item) => {
              const active = pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'flex min-h-11 w-full items-center rounded-2xl px-4 text-left text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary font-semibold text-white shadow-[0_16px_40px_rgba(12,16,40,0.45)]'
                      : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                  )}
                  activeOptions={{ exact: item.to === '/' }}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className='dashboard-sidebar-footer space-y-3'>
            <div className='space-y-1 text-xs'>
              <p className='dashboard-sidebar-meta'>
                {overview.data
                  ? `${overview.data.health.status} · ${overview.data.routing_strategy}`
                  : 'Loading runtime status…'}
              </p>
              <p className='dashboard-sidebar-meta'>
                {managementStatus.data
                  ? `Management port ${managementStatus.data.port}`
                  : managementStatus.isError
                    ? 'Management auth failed'
                    : 'Checking management access…'}
              </p>
              <p className='dashboard-sidebar-meta'>
                Theme: {theme === 'system' ? `system (${resolvedTheme})` : theme}
              </p>
            </div>
            <div className='dashboard-divider' />
            <div className='flex items-center justify-between text-xs'>
              <span className='dashboard-sidebar-meta'>System Status</span>
              <span className='text-emerald-300'>Online</span>
            </div>
            <div className='flex items-center gap-2'>
              <Badge variant='outline' className='rounded-full px-3 py-1 text-xs'>
                {providerCount} provider{providerCount === 1 ? '' : 's'}
              </Badge>
            </div>
            <div className='grid gap-2'>
              <div className='flex items-center gap-2'>
                <ThemeMenu
                  theme={theme}
                  resolvedTheme={resolvedTheme}
                  setTheme={setTheme}
                  direction='up'
                />
                <span className='text-muted-foreground text-xs'>Theme</span>
              </div>
              <Button
                type='button'
                variant='destructive'
                onClick={clearSecret}
                className='dashboard-sidebar-button w-full'
              >
                Lock
              </Button>
            </div>
          </div>
        </aside>
        <div className='flex min-h-screen flex-1 flex-col px-3 py-4 md:px-6 md:py-6'>
          <div className='dashboard-panel sticky top-3 z-20 mx-3 mt-0 px-4 py-3 backdrop-blur md:hidden'>
            <div className='flex items-center justify-between gap-3'>
              <div>
                <p className='text-muted-foreground text-xs tracking-[0.24em] uppercase'>
                  Rusuh Dashboard
                </p>
                <h1 className='mt-1 text-lg font-semibold'>Control Center</h1>
              </div>
              <div className='flex items-center justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={clearSecret}
                  className='rounded-full px-4'
                >
                  Lock
                </Button>
                <ThemeMenu
                  theme={theme}
                  resolvedTheme={resolvedTheme}
                  setTheme={setTheme}
                  align='right'
                />
                <Button
                  type='button'
                  size='sm'
                  onClick={() => setMobileNavOpen((value) => !value)}
                  aria-expanded={mobileNavOpen}
                  aria-controls='dashboard-mobile-nav'
                  className='rounded-full px-4'
                >
                  {mobileNavOpen ? 'Close' : 'Menu'}
                </Button>
              </div>
            </div>
            {mobileNavOpen ? (
              <div id='dashboard-mobile-nav' className='dashboard-enter mt-4 space-y-2'>
                <nav className='grid gap-2'>
                  {navItems.map((item) => {
                    const active = pathname === item.to
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileNavOpen(false)}
                        className={cn(
                          'flex min-h-11 items-center rounded-2xl px-4 text-sm font-medium transition-colors',
                          active
                            ? 'bg-primary font-semibold text-white'
                            : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                        )}
                        activeOptions={{ exact: item.to === '/' }}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>
                <div className='text-muted-foreground space-y-1 px-1 text-sm'>
                  <p>
                    {overview.data
                      ? `${overview.data.health.status} · ${overview.data.routing_strategy}`
                      : 'Loading runtime status…'}
                  </p>
                  <p className='text-xs leading-5'>
                    {managementStatus.data
                      ? `Mgmt port ${managementStatus.data.port} · ${providerCount} provider${providerCount === 1 ? '' : 's'}`
                      : managementStatus.isError
                        ? 'Management auth failed'
                        : 'Checking management access…'}
                  </p>
                  <p className='text-xs leading-5'>
                    Theme: {theme === 'system' ? `system (${resolvedTheme})` : theme}
                  </p>
                </div>
              </div>
            ) : null}
          </div>

          <main className='dashboard-enter dashboard-enter-delay-1 flex-1 px-2 pt-4 pb-4 md:px-4 md:pt-6 md:pb-6 xl:px-6 xl:pt-8'>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
