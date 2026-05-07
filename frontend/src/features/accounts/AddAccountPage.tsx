import { useNavigate } from '@tanstack/react-router'

import { PageShell } from '@/components/layout/PageShell'
import { Button } from '@/components/ui/Button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

import {
  KiroAccountForm,
  AntigravityAccountForm,
  CodexAccountForm,
  ZedAccountForm,
  CopilotAccountForm,
  ManualRecovery,
} from './components'
import { useAddAccountModel } from './hooks/useAddAccountModel'
import type { AddAccountOauthProvider } from './types'

export function AddAccountPage() {
  const navigate = useNavigate()
  const model = useAddAccountModel()
  const {
    provider,
    setProvider,
    limits,
    activeOauthState,
    activeOauthStatusSummary,
    activeOauthStatusData,
  } = model

  return (
    <PageShell
      eyebrow='Add Account'
      title='Add a provider account'
      description='Choose a provider to connect. Review and manage accounts on the Accounts page.'
      actions={
        <Button
          type='button'
          variant='outline'
          onClick={() => void navigate({ to: '/accounts' })}
          className='rounded-full px-5'
        >
          Back to Accounts
        </Button>
      }
    >
      <div className='grid gap-6 xl:grid-cols-[16rem_minmax(0,1fr)]'>
        <aside className='space-y-4'>
          <section className='dashboard-panel rounded-3xl p-5'>
            <p className='text-muted-foreground text-xs tracking-[0.2em] uppercase'>Flow</p>
            <ol className='mt-4 grid gap-3 text-sm'>
              <li className='flex gap-3'>
                <span className='text-primary font-semibold'>1</span>
                <span>Choose provider</span>
              </li>
              <li className='flex gap-3'>
                <span className='text-primary font-semibold'>2</span>
                <span>Sign in or import tokens</span>
              </li>
              <li className='flex gap-3'>
                <span className='text-primary font-semibold'>3</span>
                <span>Verify on Accounts</span>
              </li>
            </ol>
          </section>

          <section className='dashboard-panel rounded-3xl p-2'>
            <p className='text-muted-foreground px-3 pt-2 pb-3 text-xs tracking-[0.2em] uppercase'>
              Provider
            </p>
            <Tabs
              value={provider}
              onValueChange={(value) => setProvider(value as AddAccountOauthProvider)}
            >
              <TabsList className='grid h-auto w-full grid-cols-1 gap-1 bg-transparent p-0'>
                <TabsTrigger value='kiro' className='rounded-full'>
                  Kiro
                </TabsTrigger>
                <TabsTrigger value='antigravity' className='rounded-full'>
                  Antigravity
                </TabsTrigger>
                <TabsTrigger value='codex' className='rounded-full'>
                  Codex
                </TabsTrigger>
                <TabsTrigger value='zed' className='rounded-full'>
                  Zed
                </TabsTrigger>
                <TabsTrigger value='github-copilot' className='rounded-full'>
                  Copilot
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </section>
        </aside>

        <section className='min-w-0'>
          <Tabs
            value={provider}
            onValueChange={(value) => setProvider(value as AddAccountOauthProvider)}
          >
            <TabsContent value='kiro'>
              <KiroAccountForm
                model={model.kiro}
                limits={limits}
                activeOauthState={activeOauthState}
                activeOauthStatusSummary={activeOauthStatusSummary}
                activeOauthStatusData={activeOauthStatusData}
              />
            </TabsContent>

            <TabsContent value='antigravity'>
              <AntigravityAccountForm model={model.antigravity} limits={limits} />
            </TabsContent>

            <TabsContent value='codex'>
              <CodexAccountForm model={model.codex} limits={limits} />
            </TabsContent>

            <TabsContent value='zed'>
              <ZedAccountForm
                model={model.zed}
                limits={limits}
                activeOauthState={activeOauthState}
                activeOauthStatusSummary={activeOauthStatusSummary}
              />
            </TabsContent>

            <TabsContent value='github-copilot'>
              <CopilotAccountForm
                model={model.copilot}
                limits={limits}
                activeOauthState={activeOauthState}
                activeOauthStatusSummary={activeOauthStatusSummary}
                activeOauthStatusData={activeOauthStatusData}
              />
            </TabsContent>
          </Tabs>
        </section>

        <ManualRecovery model={model.manual} limits={limits} />
      </div>
    </PageShell>
  )
}
