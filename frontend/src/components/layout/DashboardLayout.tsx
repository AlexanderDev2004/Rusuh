import { useNavigate, useRouterState } from '@tanstack/react-router'
import { LaptopMinimal, LockKeyhole, Moon, Sun } from 'lucide-react'
import { type PropsWithChildren, useEffect, useRef, useState } from 'react'

import { useManagementStatusQuery } from '@/apis/auth/status/api'
import { useOverviewQuery } from '@/apis/dashboard/queries'
import { useThemeStore } from '@/app/theme'
import type { ThemeMenuProps } from '@/components/layout/types'
import { cn } from '@/components/shared/utils'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useManagementAuth } from '@/features/auth/AuthGate'

const navItems = [
  { to: '/', label: 'Overview' },
  { to: '/accounts', label: 'Accounts' },
  { to: '/api-keys', label: 'API Keys' },
  { to: '/config', label: 'Config' },
] as const

type NavTarget = (typeof navItems)[number]['to']

const themeOptions = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: LaptopMinimal },
] as const

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
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false)
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
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
        className='h-9 w-9 rounded-xl'
      >
        <ActiveIcon className='size-4' />
        <span className='sr-only'>Theme: {label}</span>
      </Button>
      {open ? (
        <div
          role='menu'
          className={cn(
            'dashboard-panel absolute z-40 w-44 rounded-2xl border p-1.5',
            menuPositionClass,
            menuDirectionClass,
          )}
        >
          {themeOptions.map((option) => {
            const selected = option.value === theme
            const Icon = option.icon
            return (
              <Button
                key={option.value}
                type='button'
                role='menuitem'
                variant='ghost'
                onClick={() => {
                  setTheme(option.value)
                  setOpen(false)
                }}
                className={cn(
                  'h-10 w-full justify-start gap-2 rounded-xl px-2.5',
                  selected
                    ? 'bg-primary text-primary-foreground! hover:bg-primary/90 hover:text-primary-foreground!'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
                )}
              >
                <Icon className='size-4' />
                <span className='flex-1 text-left'>{option.label}</span>
                {selected ? <span className='text-xs'>●</span> : null}
              </Button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

type NavListProps = {
  pathname: string
  onNavigate: (to: NavTarget) => void
}

function NavList({ pathname, onNavigate }: NavListProps) {
  return (
    <nav className='grid gap-1' aria-label='Dashboard navigation'>
      {navItems.map((item) => {
        const active = pathname === item.to
        return (
          <Button
            key={item.to}
            type='button'
            variant='ghost'
            aria-current={active ? 'page' : undefined}
            onClick={() => onNavigate(item.to)}
            className={cn(
              'h-10 w-full justify-start rounded-xl px-3 text-sm',
              active
                ? 'bg-primary text-primary-foreground! hover:bg-primary/90 hover:text-primary-foreground!'
                : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground',
            )}
          >
            {item.label}
          </Button>
        )
      })}
    </nav>
  )
}

function LockButton({ onLock, iconOnly = false }: { onLock: () => void; iconOnly?: boolean }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type='button'
          variant='destructive'
          size={iconOnly ? 'icon' : 'sm'}
          className={iconOnly ? 'h-9 w-9 rounded-xl' : 'rounded-xl px-4'}
        >
          <LockKeyhole className='size-4' />
          {iconOnly ? <span className='sr-only'>Lock dashboard</span> : <span>Lock</span>}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='rounded-3xl'>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <LockKeyhole className='size-5' />
          </AlertDialogMedia>
          <AlertDialogTitle>Lock dashboard?</AlertDialogTitle>
          <AlertDialogDescription>
            You will need to enter the management secret again to continue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='rounded-full px-5'>Cancel</AlertDialogCancel>
          <AlertDialogAction variant='destructive' className='rounded-full px-5' onClick={onLock}>
            Lock
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

function RuntimeSummary() {
  const overview = useOverviewQuery()
  const managementStatus = useManagementStatusQuery()
  const providerCount = overview.data?.provider_names.length ?? 0

  return (
    <div className='text-muted-foreground grid gap-1 text-xs leading-5'>
      <div className='flex items-center justify-between gap-3'>
        <span>Status</span>
        <span className='text-primary font-medium'>Online</span>
      </div>
      <p>
        {overview.data
          ? `${overview.data.health.status} · ${overview.data.routing_strategy}`
          : managementStatus.isError
            ? 'Management auth failed'
            : 'Checking runtime…'}
      </p>
      <p>
        {managementStatus.data
          ? `Management port ${managementStatus.data.port}`
          : `${providerCount} provider${providerCount === 1 ? '' : 's'}`}
      </p>
    </div>
  )
}

export function DashboardLayout({ children }: PropsWithChildren<object>) {
  const navigate = useNavigate()
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })
  const { clearSecret } = useManagementAuth()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const theme = useThemeStore((state) => state.theme)
  const resolvedTheme = useThemeStore((state) => state.resolvedTheme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const overview = useOverviewQuery()
  const providerCount = overview.data?.provider_names.length ?? 0

  const handleNavigate = (to: NavTarget) => {
    void navigate({ to })
  }

  const handleMobileNavigate = (to: NavTarget) => {
    setMobileNavOpen(false)
    void navigate({ to })
  }

  return (
    <div className='bg-background text-foreground h-screen overflow-hidden'>
      <div className='grid h-full min-h-0 grid-cols-1 md:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[16rem_minmax(0,1fr)]'>
        <aside className='bg-sidebar border-sidebar-border hidden min-h-0 border-r md:flex md:flex-col'>
          <div className='border-sidebar-border border-b px-4 py-4'>
            <p className='text-muted-foreground text-[0.68rem] font-medium tracking-[0.24em] uppercase'>
              Rusuh
            </p>
            <h1 className='mt-1 text-xl font-semibold tracking-[-0.03em]'>Control Center</h1>
          </div>

          <div className='flex-1 px-3 py-4'>
            <NavList pathname={pathname} onNavigate={handleNavigate} />
          </div>

          <div className='border-sidebar-border space-y-3 border-t p-3'>
            <RuntimeSummary />
            <div className='flex items-center justify-between gap-2'>
              <ThemeMenu
                theme={theme}
                resolvedTheme={resolvedTheme}
                setTheme={setTheme}
                direction='up'
              />
              <LockButton onLock={clearSecret} />
            </div>
          </div>
        </aside>

        <main className='min-h-0 overflow-y-auto px-3 py-4 md:px-6 md:py-6 xl:px-8'>
          <div className='mb-4 flex items-center justify-between gap-3 md:hidden'>
            <div>
              <p className='text-muted-foreground text-[0.68rem] font-medium tracking-[0.24em] uppercase'>
                Rusuh
              </p>
              <h1 className='text-lg font-semibold tracking-[-0.03em]'>Control Center</h1>
            </div>
            <div className='flex items-center gap-2'>
              <ThemeMenu
                theme={theme}
                resolvedTheme={resolvedTheme}
                setTheme={setTheme}
                align='right'
              />
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setMobileNavOpen((value) => !value)}
                aria-expanded={mobileNavOpen}
                aria-controls='dashboard-mobile-nav'
                className='rounded-xl px-3'
              >
                Menu
              </Button>
            </div>
          </div>

          {mobileNavOpen ? (
            <div
              id='dashboard-mobile-nav'
              className='dashboard-panel border-border mb-4 rounded-2xl border p-2 md:hidden'
            >
              <NavList pathname={pathname} onNavigate={handleMobileNavigate} />
              <div className='dashboard-divider my-3' />
              <div className='flex items-center justify-between gap-2 px-1 pb-1'>
                <Badge variant='outline' className='rounded-full px-3 py-1 text-xs'>
                  {providerCount} provider{providerCount === 1 ? '' : 's'}
                </Badge>
                <LockButton onLock={clearSecret} />
              </div>
            </div>
          ) : null}

          <div className='mx-auto w-full max-w-[1180px]'>{children}</div>
        </main>
      </div>
    </div>
  )
}
