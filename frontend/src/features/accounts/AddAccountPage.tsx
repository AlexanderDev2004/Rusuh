import { useNavigate } from '@tanstack/react-router'

import { PageShell } from '@/components/layout/PageShell'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/Collapsible'
import { Input } from '@/components/ui/Input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Textarea } from '@/components/ui/Textarea'

import { useAddAccountModel } from './hooks/useAddAccountModel'
import type { AddAccountOauthProvider } from './types'

export function AddAccountPage() {
  const navigate = useNavigate()
  const model = useAddAccountModel()
  const { limits, provider, setProvider } = model

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
            <TabsContent value='kiro' className='space-y-6 pt-0'>
              <section className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <h3 className='text-lg font-semibold'>Kiro</h3>
                  <Badge variant='outline' className='rounded-full px-2.5 py-1 text-xs'>
                    fastest path
                  </Badge>
                </div>
                <p className='text-muted-foreground max-w-2xl text-sm'>
                  Use Builder ID first. Use imports only if you already have tokens.
                </p>
              </section>

              <section className='space-y-3'>
                <div className='dashboard-panel flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between'>
                  <div>
                    <p className='font-medium'>Builder ID</p>
                    <p className='text-muted-foreground text-sm'>
                      Opens a sign-in flow in a new tab.
                    </p>
                  </div>
                  <Button
                    type='button'
                    onClick={model.kiro.startBuilderFlow}
                    disabled={model.kiro.isStartingBuilderId}
                    className='rounded-full px-5'
                  >
                    {model.kiro.isStartingBuilderId ? 'Launching…' : 'Start Builder ID'}
                  </Button>
                </div>

                <div className='dashboard-panel text-muted-foreground rounded-2xl p-4 text-sm leading-6'>
                  {model.activeOauthState ? (
                    <>
                      <p>
                        Session ID{' '}
                        <span className='text-foreground break-all'>{model.activeOauthState}</span>
                      </p>
                      <p>
                        Status{' '}
                        <span className='text-foreground'>{model.activeOauthStatusSummary}</span>
                      </p>
                    </>
                  ) : (
                    <p>No sign-in session started yet.</p>
                  )}
                  {model.activeOauthStatusData?.error ? (
                    <p className='text-destructive mt-2'>{model.activeOauthStatusData.error}</p>
                  ) : null}
                </div>
              </section>

              <section className='space-y-4'>
                <div className='flex flex-wrap items-center justify-between gap-3'>
                  <div>
                    <h4 className='font-medium'>Import tokens</h4>
                    <p className='text-muted-foreground text-sm'>
                      Paste token fields or full JSON.
                    </p>
                  </div>
                  <Select
                    value={model.kiro.importMode}
                    onValueChange={(value) =>
                      model.kiro.setImportMode(value as 'structured' | 'json')
                    }
                  >
                    <SelectTrigger className='h-11 w-[180px] rounded-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='structured'>Structured</SelectItem>
                      <SelectItem value='json'>Paste JSON</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <label className='grid gap-2'>
                  <span className='text-sm font-medium'>Account name</span>
                  <Input
                    type='text'
                    value={model.kiro.label}
                    onChange={(event) => model.kiro.setLabel(event.target.value)}
                    placeholder='e.g. Kiro work account'
                    maxLength={limits.maxLabelLength}
                    className='h-11 rounded-2xl'
                  />
                  <span className='text-muted-foreground text-xs'>
                    Only used to identify this account in the dashboard. You can leave it empty.
                  </span>
                </label>

                {model.kiro.importMode === 'structured' ? (
                  <div className='grid gap-3 lg:grid-cols-2'>
                    <Input
                      value={model.kiro.accessToken}
                      onChange={(event) => model.kiro.setAccessToken(event.target.value)}
                      placeholder='access_token'
                      className='h-11 rounded-2xl'
                    />
                    <Input
                      value={model.kiro.refreshToken}
                      onChange={(event) => model.kiro.setRefreshToken(event.target.value)}
                      placeholder='refresh_token'
                      className='h-11 rounded-2xl'
                    />
                    <Input
                      value={model.kiro.expiresAt}
                      onChange={(event) => model.kiro.setExpiresAt(event.target.value)}
                      placeholder='expires_at (RFC3339)'
                      className='h-11 rounded-2xl'
                    />
                    <Input
                      value={model.kiro.clientId}
                      onChange={(event) => model.kiro.setClientId(event.target.value)}
                      placeholder='client_id'
                      className='h-11 rounded-2xl'
                    />
                    <Input
                      value={model.kiro.clientSecret}
                      onChange={(event) => model.kiro.setClientSecret(event.target.value)}
                      placeholder='client_secret'
                      className='h-11 rounded-2xl'
                    />
                    <Input
                      value={model.kiro.profileArn}
                      onChange={(event) => model.kiro.setProfileArn(event.target.value)}
                      placeholder='profile_arn (optional)'
                      className='h-11 rounded-2xl'
                    />
                    <Input
                      value={model.kiro.provider}
                      onChange={(event) => model.kiro.setProvider(event.target.value)}
                      placeholder='provider'
                      className='h-11 rounded-2xl'
                    />
                    <Input
                      value={model.kiro.region}
                      onChange={(event) => model.kiro.setRegion(event.target.value)}
                      placeholder='region'
                      className='h-11 rounded-2xl'
                    />
                    <Input
                      value={model.kiro.startUrl}
                      onChange={(event) => model.kiro.setStartUrl(event.target.value)}
                      placeholder='start_url'
                      className='h-11 rounded-2xl lg:col-span-2'
                    />
                    <Input
                      value={model.kiro.email}
                      onChange={(event) => model.kiro.setEmail(event.target.value)}
                      placeholder='email (optional)'
                      className='h-11 rounded-2xl lg:col-span-2'
                    />
                  </div>
                ) : (
                  <Textarea
                    value={model.kiro.importJson}
                    onChange={(event) => model.kiro.setImportJson(event.target.value)}
                    placeholder='{"access_token":"...","refresh_token":"..."}'
                    className='min-h-40 rounded-2xl px-4 py-3'
                  />
                )}

                <div className='flex justify-end'>
                  <Button
                    type='button'
                    onClick={model.kiro.submitImport}
                    disabled={model.kiro.isImporting}
                    className='h-11 rounded-full px-5'
                  >
                    {model.kiro.isImporting ? 'Importing…' : 'Import Kiro auth'}
                  </Button>
                </div>
              </section>

              <section className='space-y-3'>
                <div>
                  <h4 className='font-medium'>Import social token</h4>
                  <p className='text-muted-foreground text-sm'>
                    Use this only if you already have a refresh token.
                  </p>
                </div>
                <Textarea
                  value={model.kiro.socialRefreshToken}
                  onChange={(event) => model.kiro.setSocialRefreshToken(event.target.value)}
                  placeholder='aorAAAAAG...'
                  className='min-h-24 rounded-2xl px-4 py-3'
                />
                <div className='flex justify-end'>
                  <Button
                    type='button'
                    onClick={model.kiro.submitSocialImport}
                    disabled={model.kiro.isImportingSocial}
                    className='h-11 rounded-full px-5'
                  >
                    {model.kiro.isImportingSocial ? 'Importing…' : 'Import social token'}
                  </Button>
                </div>
              </section>
            </TabsContent>

            <TabsContent value='antigravity' className='space-y-6 pt-2'>
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
                    value={model.antigravity.label}
                    onChange={(event) => model.antigravity.setLabel(event.target.value)}
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
                    onClick={model.antigravity.startOauth}
                    disabled={model.antigravity.isStartingOauth}
                    className='h-11 rounded-full px-5'
                  >
                    {model.antigravity.isStartingOauth ? 'Generating link…' : 'Start OAuth'}
                  </Button>
                </div>

                {model.antigravity.authUrl ? (
                  <div className='dashboard-panel space-y-3 rounded-2xl p-4'>
                    <p className='text-muted-foreground text-sm'>Open this login link manually:</p>
                    <Input
                      value={model.antigravity.authUrl}
                      readOnly
                      className='h-11 rounded-2xl'
                    />
                    <div className='flex justify-end'>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() =>
                          window.open(model.antigravity.authUrl, '_blank', 'noopener,noreferrer')
                        }
                        className='rounded-full px-5'
                      >
                        Open login link
                      </Button>
                    </div>
                  </div>
                ) : null}

                <div className='dashboard-panel space-y-3 rounded-2xl p-4'>
                  <p className='text-muted-foreground text-sm'>
                    Paste localhost callback URL after login:
                  </p>
                  <Textarea
                    value={model.antigravity.callbackUrl}
                    onChange={(event) => model.antigravity.setCallbackUrl(event.target.value)}
                    placeholder='http://localhost:3456/antigravity/callback?code=...&state=...'
                    className='min-h-24 rounded-2xl px-4 py-3'
                  />
                  <div className='flex justify-end'>
                    <Button
                      type='button'
                      onClick={model.antigravity.submitCallback}
                      disabled={
                        model.antigravity.isSubmittingCallback ||
                        model.antigravity.callbackUrl.trim().length === 0
                      }
                      className='h-11 rounded-full px-5'
                    >
                      {model.antigravity.isSubmittingCallback
                        ? 'Submitting…'
                        : 'Submit callback URL'}
                    </Button>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value='codex' className='space-y-6 pt-2'>
              <section className='space-y-3'>
                <h3 className='text-lg font-semibold'>Codex</h3>
                <p className='text-muted-foreground max-w-2xl text-sm'>
                  Start sign-in here, then review the account on the Accounts page.
                </p>
              </section>

              <section className='max-w-xl space-y-4'>
                <label className='grid gap-2'>
                  <span className='text-sm font-medium'>Account name</span>
                  <Input
                    type='text'
                    value={model.codex.label}
                    onChange={(event) => model.codex.setLabel(event.target.value)}
                    className='h-11 rounded-2xl'
                    placeholder='e.g. Codex team account'
                    maxLength={limits.maxLabelLength}
                  />
                  <span className='text-muted-foreground text-xs'>
                    Only used to identify this account in the dashboard. You can leave it empty.
                  </span>
                </label>
                <div className='flex justify-end'>
                  <Button
                    type='button'
                    onClick={model.codex.startOauth}
                    disabled={model.codex.isStartingOauth}
                    className='h-11 rounded-full px-5'
                  >
                    {model.codex.isStartingOauth ? 'Generating link…' : 'Start OAuth'}
                  </Button>
                </div>

                {model.codex.authUrl ? (
                  <div className='dashboard-panel space-y-3 rounded-2xl p-4'>
                    <p className='text-muted-foreground text-sm'>Open this login link manually:</p>
                    <Input value={model.codex.authUrl} readOnly className='h-11 rounded-2xl' />
                    <div className='flex justify-end'>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() =>
                          window.open(model.codex.authUrl, '_blank', 'noopener,noreferrer')
                        }
                        className='rounded-full px-5'
                      >
                        Open login link
                      </Button>
                    </div>
                  </div>
                ) : null}

                <div className='dashboard-panel space-y-3 rounded-2xl p-4'>
                  <p className='text-muted-foreground text-sm'>
                    Paste localhost callback URL after login:
                  </p>
                  <Textarea
                    value={model.codex.callbackUrl}
                    onChange={(event) => model.codex.setCallbackUrl(event.target.value)}
                    placeholder='http://localhost:3456/codex/callback?code=...&state=...'
                    className='min-h-24 rounded-2xl px-4 py-3'
                  />
                  <div className='flex justify-end'>
                    <Button
                      type='button'
                      onClick={model.codex.submitCallback}
                      disabled={
                        model.codex.isSubmittingCallback ||
                        model.codex.callbackUrl.trim().length === 0
                      }
                      className='h-11 rounded-full px-5'
                    >
                      {model.codex.isSubmittingCallback ? 'Submitting…' : 'Submit callback URL'}
                    </Button>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent value='zed' className='space-y-6 pt-2'>
              <section className='space-y-3'>
                <h3 className='text-lg font-semibold'>Zed</h3>
                <p className='text-muted-foreground max-w-2xl text-sm'>
                  Start the native-app sign-in flow here, then review the account on the Accounts
                  page.
                </p>
              </section>

              <section className='max-w-xl space-y-4'>
                <label className='grid gap-2'>
                  <span className='text-sm font-medium'>Account name</span>
                  <Input
                    type='text'
                    value={model.zed.label}
                    onChange={(event) => model.zed.setLabel(event.target.value)}
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
                    onClick={model.zed.startLogin}
                    disabled={model.zed.isStartingLogin}
                    className='h-11 rounded-full px-5'
                  >
                    {model.zed.isStartingLogin ? 'Launching…' : 'Start Zed login'}
                  </Button>
                </div>

                {model.zed.loginUrl ? (
                  <div className='dashboard-panel space-y-3 rounded-2xl p-4'>
                    <p className='text-muted-foreground text-sm'>Open this login link manually:</p>
                    <Input value={model.zed.loginUrl} readOnly className='h-11 rounded-2xl' />
                    {model.zed.port ? (
                      <p className='text-muted-foreground text-sm'>
                        Native app callback port: {model.zed.port}
                      </p>
                    ) : null}
                    <div className='flex justify-end'>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() =>
                          window.open(model.zed.loginUrl, '_blank', 'noopener,noreferrer')
                        }
                        className='rounded-full px-5'
                      >
                        Open login link
                      </Button>
                    </div>
                  </div>
                ) : null}

                <div className='dashboard-panel text-muted-foreground rounded-2xl p-4 text-sm leading-6'>
                  {model.activeOauthState ? (
                    <>
                      <p>
                        Session ID{' '}
                        <span className='text-foreground break-all'>{model.activeOauthState}</span>
                      </p>
                      <p>
                        Status{' '}
                        <span className='text-foreground'>{model.activeOauthStatusSummary}</span>
                      </p>
                      {model.zed.statusData?.filename ? (
                        <p>
                          Auth file{' '}
                          <span className='text-foreground break-all'>
                            {model.zed.statusData.filename}
                          </span>
                        </p>
                      ) : null}
                      {model.zed.statusData?.user_id ? (
                        <p>
                          User ID{' '}
                          <span className='text-foreground break-all'>
                            {model.zed.statusData.user_id}
                          </span>
                        </p>
                      ) : null}
                    </>
                  ) : (
                    <p>No sign-in session started yet.</p>
                  )}
                  {model.zed.statusError ? (
                    <p className='text-destructive mt-2'>{model.zed.statusError.message}</p>
                  ) : null}
                </div>
              </section>
            </TabsContent>

            <TabsContent value='github-copilot' className='space-y-6 pt-2'>
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
                    value={model.copilot.label}
                    onChange={(event) => model.copilot.setLabel(event.target.value)}
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
                    onClick={model.copilot.startOauth}
                    disabled={model.copilot.isStartingOauth}
                    className='h-11 rounded-full px-5'
                  >
                    {model.copilot.isStartingOauth ? 'Starting…' : 'Start OAuth'}
                  </Button>
                </div>

                {model.copilot.userCode ? (
                  <div className='dashboard-panel space-y-3 rounded-2xl p-4'>
                    <p className='text-muted-foreground text-sm'>Enter this code on GitHub:</p>
                    <Input
                      value={model.copilot.userCode}
                      readOnly
                      className='h-11 rounded-2xl text-center font-mono text-lg font-semibold'
                    />
                    <Input
                      value={model.copilot.verificationUri}
                      readOnly
                      className='h-11 rounded-2xl'
                    />
                    {model.copilot.expiryHint ? (
                      <p className='text-muted-foreground text-sm'>{model.copilot.expiryHint}</p>
                    ) : null}
                    <div className='flex justify-end'>
                      <Button
                        type='button'
                        variant='outline'
                        onClick={() =>
                          window.open(
                            model.copilot.verificationUri,
                            '_blank',
                            'noopener,noreferrer',
                          )
                        }
                        className='rounded-full px-5'
                      >
                        Open GitHub
                      </Button>
                    </div>
                  </div>
                ) : null}

                <div className='dashboard-panel text-muted-foreground rounded-2xl p-4 text-sm leading-6'>
                  {model.activeOauthState ? (
                    <>
                      <p>
                        Session ID{' '}
                        <span className='text-foreground break-all'>{model.activeOauthState}</span>
                      </p>
                      <p>
                        Status{' '}
                        <span className='text-foreground'>{model.activeOauthStatusSummary}</span>
                      </p>
                    </>
                  ) : (
                    <p>No sign-in session started yet.</p>
                  )}
                  {model.activeOauthStatusData?.error ? (
                    <p className='text-destructive mt-2'>{model.activeOauthStatusData.error}</p>
                  ) : null}
                </div>
              </section>
            </TabsContent>
          </Tabs>
        </section>

        <section className='space-y-3'>
          <Collapsible open={model.manual.showAdvanced} onOpenChange={model.manual.setShowAdvanced}>
            <div className='flex items-center justify-between gap-3'>
              <div>
                <h3 className='text-base font-semibold'>Manual recovery</h3>
                <p className='text-muted-foreground text-sm'>
                  Use this only if sign-in or token import is not an option.
                </p>
              </div>
              <CollapsibleTrigger asChild>
                <Button type='button' variant='outline' className='rounded-full px-5'>
                  {model.manual.showAdvanced ? 'Hide' : 'Show'}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className='collapsible-smooth overflow-hidden pt-4'>
              <div className='grid gap-4'>
                <Input
                  type='file'
                  accept='.json,application/json'
                  onChange={model.manual.handleUploadFileChange}
                  className='h-11 rounded-2xl file:mr-4 file:border-0 file:bg-transparent file:text-sm file:font-medium'
                />
                {model.manual.uploadFileError ? (
                  <p className='text-destructive text-sm'>{model.manual.uploadFileError}</p>
                ) : null}
                <Input
                  type='text'
                  value={model.manual.uploadName}
                  onChange={(event) => model.manual.setUploadName(event.target.value)}
                  className='h-11 rounded-2xl'
                  placeholder='auth-file.json'
                  maxLength={limits.maxUploadNameLength}
                />
                <Textarea
                  value={model.manual.uploadBody}
                  onChange={(event) => model.manual.setUploadBody(event.target.value)}
                  className='min-h-40 rounded-2xl px-4 py-3'
                  placeholder='{"type":"antigravity"}'
                  maxLength={limits.maxUploadBodyLength}
                />
                <div>
                  <Button
                    type='button'
                    onClick={model.manual.submitUpload}
                    disabled={
                      model.manual.isUploading ||
                      model.manual.uploadName.trim().length === 0 ||
                      model.manual.uploadBody.trim().length === 0
                    }
                    className='h-11 rounded-full px-5'
                  >
                    {model.manual.isUploading ? 'Uploading…' : 'Upload auth file'}
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </section>
      </div>
    </PageShell>
  )
}
