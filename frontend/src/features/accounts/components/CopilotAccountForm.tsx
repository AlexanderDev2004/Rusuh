import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

import type { AddAccountModel } from '../hooks/useAddAccountModel'

interface CopilotAccountFormProps {
  model: AddAccountModel['copilot']
  limits: AddAccountModel['limits']
  activeOauthState: AddAccountModel['activeOauthState']
  activeOauthStatusSummary: AddAccountModel['activeOauthStatusSummary']
  activeOauthStatusData: AddAccountModel['activeOauthStatusData']
}

export function CopilotAccountForm({
  model,
  limits,
  activeOauthState,
  activeOauthStatusSummary,
  activeOauthStatusData,
}: CopilotAccountFormProps) {
  return (
    <div className='space-y-6 pt-2'>
      <section className='space-y-3'>
        <h3 className='text-lg font-semibold'>GitHub Copilot</h3>
        <p className='text-muted-foreground max-w-2xl text-sm'>
          Start the device-code flow, then approve it on GitHub.
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
            placeholder='e.g. Copilot personal account'
            maxLength={limits.maxLabelLength}
          />
          <span className='text-muted-foreground text-xs'>
            Only used to identify this account in the dashboard. You can leave it empty.
          </span>
        </label>
        <div className='flex justify-end'>
          <Button
            type='button'
            onClick={model.startOauth}
            disabled={model.isStartingOauth}
            className='h-11 rounded-full px-5'
          >
            {model.isStartingOauth ? 'Starting…' : 'Start OAuth'}
          </Button>
        </div>

        {model.userCode ? (
          <div className='dashboard-panel space-y-3 rounded-2xl p-4'>
            <p className='text-muted-foreground text-sm'>Enter this code on GitHub:</p>
            <Input
              value={model.userCode}
              readOnly
              className='h-11 rounded-2xl text-center font-mono text-lg font-semibold'
            />
            <Input value={model.verificationUri} readOnly className='h-11 rounded-2xl' />
            {model.expiryHint ? (
              <p className='text-muted-foreground text-sm'>{model.expiryHint}</p>
            ) : null}
            <div className='flex justify-end'>
              <Button
                type='button'
                variant='outline'
                onClick={() => window.open(model.verificationUri, '_blank', 'noopener,noreferrer')}
                className='rounded-full px-5'
              >
                Open GitHub
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
            </>
          ) : (
            <p>No sign-in session started yet.</p>
          )}
          {activeOauthStatusData?.error ? (
            <p className='text-destructive mt-2'>{activeOauthStatusData.error}</p>
          ) : null}
        </div>
      </section>
    </div>
  )
}
