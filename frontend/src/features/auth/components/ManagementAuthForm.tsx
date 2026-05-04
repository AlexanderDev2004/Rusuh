import { useState } from 'react'

import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'

import type { ManagementAuthFormProps } from '../types'

export function ManagementAuthForm({ onUnlock }: ManagementAuthFormProps) {
  const [value, setValue] = useState('')
  const [persist, setPersist] = useState(true)

  return (
    <div className='bg-background text-foreground flex min-h-screen items-center justify-center p-4 sm:p-6'>
      <Card className='w-full max-w-md rounded-3xl'>
        <CardContent className='p-5 sm:p-6'>
          <p className='text-muted-foreground text-xs tracking-[0.24em] uppercase'>
            Dashboard Auth
          </p>
          <h1 className='mt-2 text-2xl font-semibold tracking-[-0.02em]'>
            Enter management secret
          </h1>
          <p className='text-muted-foreground mt-3 text-sm leading-6'>
            Needed for `/v0/management/*` mutations. Stored in session storage for this tab only.
          </p>
          <form
            className='mt-6 space-y-4'
            onSubmit={(event) => {
              event.preventDefault()
              const nextValue = value.trim()
              if (!nextValue) return
              onUnlock(nextValue, persist)
            }}
          >
            <label className='block space-y-2'>
              <span className='text-muted-foreground text-sm'>Secret</span>
              <Input
                type='password'
                value={value}
                onChange={(event) => setValue(event.target.value)}
                className='h-11 rounded-2xl'
                placeholder='sk-...'
              />
            </label>

            <div className='border-border bg-background/50 rounded-2xl border p-3'>
              <label className='text-muted-foreground flex items-start gap-3 text-sm leading-6'>
                <input
                  type='checkbox'
                  checked={persist}
                  onChange={(event) => setPersist(event.target.checked)}
                  className='mt-1 h-4 w-4 shrink-0 accent-current'
                />
                <span>
                  Keep for this tab session
                  <span className='text-muted-foreground/80 block text-xs'>
                    Auto-clears when the tab session ends.
                  </span>
                </span>
              </label>
            </div>
            <Button type='submit' className='h-11 w-full rounded-2xl'>
              Unlock dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
