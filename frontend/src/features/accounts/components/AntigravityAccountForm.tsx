import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

import type { AddAccountModel } from '../hooks/useAddAccountModel'

interface AntigravityAccountFormProps {
  model: AddAccountModel['antigravity']
  limits: AddAccountModel['limits']
}

export function AntigravityAccountForm({ model, limits }: AntigravityAccountFormProps) {
  return (
    <div className='space-y-6 pt-2'>
      <section className='space-y-3'>
        <h3 className='text-lg font-semibold'>Antigravity</h3>
        <p className='text-muted-foreground max-w-2xl text-sm'>
          Start sign-in here, then review the account on the Accounts page.
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
            placeholder='e.g. Antigravity work account'
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
            {model.isStartingOauth ? 'Generating link…' : 'Start OAuth'}
          </Button>
        </div>

        {model.authUrl ? (
          <div className='dashboard-panel space-y-3 rounded-2xl p-4'>
            <p className='text-muted-foreground text-sm'>Open this login link manually:</p>
            <Input value={model.authUrl} readOnly className='h-11 rounded-2xl' />
            <div className='flex justify-end'>
              <Button
                type='button'
                variant='outline'
                onClick={() => window.open(model.authUrl, '_blank', 'noopener,noreferrer')}
                className='rounded-full px-5'
              >
                Open login link
              </Button>
            </div>
          </div>
        ) : null}

        <div className='dashboard-panel space-y-3 rounded-2xl p-4'>
          <p className='text-muted-foreground text-sm'>Paste localhost callback URL after login:</p>
          <Textarea
            value={model.callbackUrl}
            onChange={(event) => model.setCallbackUrl(event.target.value)}
            placeholder='http://localhost:3456/antigravity/callback?code=...&state=...'
            className='min-h-24 rounded-2xl px-4 py-3'
          />
          <div className='flex justify-end'>
            <Button
              type='button'
              onClick={model.submitCallback}
              disabled={model.isSubmittingCallback || model.callbackUrl.trim().length === 0}
              className='h-11 rounded-full px-5'
            >
              {model.isSubmittingCallback ? 'Submitting…' : 'Submit callback URL'}
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
