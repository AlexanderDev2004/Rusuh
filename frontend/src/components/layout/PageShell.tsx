import type { PropsWithChildren } from 'react'

import type { PageShellProps } from './types'

export function PageShell({
  eyebrow,
  title,
  description,
  actions,
  children,
}: PropsWithChildren<PageShellProps>) {
  return (
    <div className='dashboard-enter'>
      <header className='mb-5 flex flex-col gap-4 md:mb-6 lg:flex-row lg:items-end lg:justify-between'>
        <div className='max-w-3xl'>
          <p className='text-muted-foreground/90 text-[0.68rem] font-medium tracking-[0.24em] uppercase'>
            {eyebrow}
          </p>
          <h2 className='text-foreground mt-2 max-w-4xl text-2xl font-semibold tracking-[-0.03em] md:text-[2rem]'>
            {title}
          </h2>
          <p className='text-muted-foreground mt-2 max-w-2xl text-sm leading-6'>{description}</p>
        </div>
        {actions ? (
          <div className='flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap lg:w-auto lg:justify-end'>
            {actions}
          </div>
        ) : null}
      </header>
      <section>{children}</section>
    </div>
  )
}
