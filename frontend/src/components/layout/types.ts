import type { ReactNode } from 'react'

export type PageShellProps = {
  eyebrow: string
  title: string
  description: string
  actions?: ReactNode
}

export type ThemeMenuProps = {
  theme: 'light' | 'dark' | 'system'
  resolvedTheme: 'light' | 'dark'
  setTheme: (value: 'light' | 'dark' | 'system') => void
  align?: 'left' | 'right'
  direction?: 'up' | 'down'
}
