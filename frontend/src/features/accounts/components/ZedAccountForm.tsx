import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

import type { AddAccountModel } from '../hooks/useAddAccountModel'

interface ZedAccountFormProps {
  model: AddAccountModel['zed']
  limits: AddAccountModel['limits']
  activeOauthState: AddAccountModel['activeOauthState']
  activeOauthStatusSummary: AddAccountModel['activeOauthStatusSummary']
}

export function ZedAccountForm({
  model,
  limits,
  activeOauthState,
  activeOauthStatusSummary,
}: ZedAccountFormProps) {
  return (
    <div className='space-y-6 pt-2'>
      <section className='space-y-3'>
        <h3 className='text-lg font-semibold'>Zed</h3>
        <p className='text-muted-foreground max-w-2xl text-sm'>
          Start the native-app sign-in flow here, then review the account on the Accounts page.
        </p>
      </section>

      <section className='max-w-xl space-y-4'>
        <label className='grid gap-2'>
          <span className='text-sm font-medium'>Account name</span>
          <Input
            type='text'
            value={model.label}
            onChange={(event) => model.setLabel(event.target.value)}
            className='h-11 rounded-2xl'
            placeholder='e.g. Zed laptop account'
            maxLength={limits.maxLabelLength}
          />
          <span className='text-muted-foreground text-xs'>
            Only used to identify this account in the dashboard. You can leave it empty.
          </span>
        </label>
        <div className='flex justify-end'>
          <Button
            type='button'
            onClick={model.startLogin}
            disabled={model.isStartingLogin}
            className='h-11 rounded-full px-5'
          >
            {model.isStartingLogin ? 'Launching…' : 'Start Zed login'}
          </Button>
        </div>

        {model.loginUrl ? (
          <div className='dashboard-panel space-y-3 rounded-2xl p-4'>
            <p className='text-muted-foreground text-sm'>Open this login link manually:</p>
            <Input value={model.loginUrl} readOnly className='h-11 rounded-2xl' />
            {model.port ? (
              <p className='text-muted-foreground text-sm'>
                Native app callback port: {model.port}
              </p>
            ) : null}
            <div className='flex justify-end'>
              <Button
                type='button'
                variant='outline'
                onClick={() => window.open(model.loginUrl, '_blank', 'noopener,noreferrer')}
                className='rounded-full px-5'
              >
                Open login link
              </Button>
            </div>
          </div>
        ) : null}

        <div className='dashboard-panel text-muted-foreground rounded-2xl p-4 text-sm leading-6'>
          {activeOauthState ? (
            <>
              <p>
                Session ID <span className='text-foreground break-all'>{activeOauthState}</span>
              </p>
              <p>
                Status <span className='text-foreground'>{activeOauthStatusSummary}</span>
              </p>
              {model.statusData?.filename ? (
                <p>
                  Auth file{' '}
                  <span className='text-foreground break-all'>{model.statusData.filename}</span>
                </p>
              ) : null}
              {model.statusData?.user_id ? (
                <p>
                  User ID{' '}
                  <span className='text-foreground break-all'>{model.statusData.user_id}</span>
                </p>
              ) : null}
            </>
          ) : (
            <p>No sign-in session started yet.</p>
          )}
          {model.statusError ? (
            <p className='text-destructive mt-2'>{model.statusError.message}</p>
          ) : null}
        </div>
      </section>
    </div>
  )
}
