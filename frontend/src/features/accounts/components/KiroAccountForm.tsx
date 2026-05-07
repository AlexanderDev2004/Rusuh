import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Textarea } from '@/components/ui/Textarea'
import { Badge } from '@/components/ui/Badge'

import type { AddAccountModel } from '../hooks/useAddAccountModel'

interface KiroAccountFormProps {
  model: AddAccountModel['kiro']
  limits: AddAccountModel['limits']
  activeOauthState: AddAccountModel['activeOauthState']
  activeOauthStatusSummary: AddAccountModel['activeOauthStatusSummary']
  activeOauthStatusData: AddAccountModel['activeOauthStatusData']
}

export function KiroAccountForm({
  model,
  limits,
  activeOauthState,
  activeOauthStatusSummary,
  activeOauthStatusData,
}: KiroAccountFormProps) {
  return (
    <div className="space-y-6 pt-0">
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Kiro</h3>
          <Badge variant="outline" className="rounded-full px-2.5 py-1 text-xs">
            fastest path
          </Badge>
        </div>
        <p className="text-muted-foreground max-w-2xl text-sm">
          Use Builder ID first. Use imports only if you already have tokens.
        </p>
      </section>

      <section className="space-y-3">
        <div className="dashboard-panel flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">Builder ID</p>
            <p className="text-muted-foreground text-sm">
              Opens a sign-in flow in a new tab.
            </p>
          </div>
          <Button
            type="button"
            onClick={model.startBuilderFlow}
            disabled={model.isStartingBuilderId}
            className="rounded-full px-5"
          >
            {model.isStartingBuilderId ? 'Launching…' : 'Start Builder ID'}
          </Button>
        </div>

        <div className="dashboard-panel text-muted-foreground rounded-2xl p-4 text-sm leading-6">
          {activeOauthState ? (
            <>
              <p>
                Session ID{' '}
                <span className="text-foreground break-all">{activeOauthState}</span>
              </p>
              <p>
                Status{' '}
                <span className="text-foreground">{activeOauthStatusSummary}</span>
              </p>
            </>
          ) : (
            <p>No sign-in session started yet.</p>
          )}
          {activeOauthStatusData?.error ? (
            <p className="text-destructive mt-2">{activeOauthStatusData.error}</p>
          ) : null}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="font-medium">Import tokens</h4>
            <p className="text-muted-foreground text-sm">
              Paste token fields or full JSON.
            </p>
          </div>
          <Select
            value={model.importMode}
            onValueChange={(value) =>
              model.setImportMode(value as 'structured' | 'json')
            }
          >
            <SelectTrigger className="h-11 w-[180px] rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="structured">Structured</SelectItem>
              <SelectItem value="json">Paste JSON</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <label className="grid gap-2">
          <span className="text-sm font-medium">Account name</span>
          <Input
            type="text"
            value={model.label}
            onChange={(event) => model.setLabel(event.target.value)}
            placeholder="e.g. Kiro work account"
            maxLength={limits.maxLabelLength}
            className="h-11 rounded-2xl"
          />
          <span className="text-muted-foreground text-xs">
            Only used to identify this account in the dashboard. You can leave it empty.
          </span>
        </label>

        {model.importMode === 'structured' ? (
          <div className="grid gap-3 lg:grid-cols-2">
            <Input
              value={model.accessToken}
              onChange={(event) => model.setAccessToken(event.target.value)}
              placeholder="access_token"
              className="h-11 rounded-2xl"
            />
            <Input
              value={model.refreshToken}
              onChange={(event) => model.setRefreshToken(event.target.value)}
              placeholder="refresh_token"
              className="h-11 rounded-2xl"
            />
            <Input
              value={model.expiresAt}
              onChange={(event) => model.setExpiresAt(event.target.value)}
              placeholder="expires_at (RFC3339)"
              className="h-11 rounded-2xl"
            />
            <Input
              value={model.clientId}
              onChange={(event) => model.setClientId(event.target.value)}
              placeholder="client_id"
              className="h-11 rounded-2xl"
            />
            <Input
              value={model.clientSecret}
              onChange={(event) => model.setClientSecret(event.target.value)}
              placeholder="client_secret"
              className="h-11 rounded-2xl"
            />
            <Input
              value={model.profileArn}
              onChange={(event) => model.setProfileArn(event.target.value)}
              placeholder="profile_arn (optional)"
              className="h-11 rounded-2xl"
            />
            <Input
              value={model.provider}
              onChange={(event) => model.setProvider(event.target.value)}
              placeholder="provider"
              className="h-11 rounded-2xl"
            />
            <Input
              value={model.region}
              onChange={(event) => model.setRegion(event.target.value)}
              placeholder="region"
              className="h-11 rounded-2xl"
            />
            <Input
              value={model.startUrl}
              onChange={(event) => model.setStartUrl(event.target.value)}
              placeholder="start_url"
              className="h-11 rounded-2xl lg:col-span-2"
            />
            <Input
              value={model.email}
              onChange={(event) => model.setEmail(event.target.value)}
              placeholder="email (optional)"
              className="h-11 rounded-2xl lg:col-span-2"
            />
          </div>
        ) : (
          <Textarea
            value={model.importJson}
            onChange={(event) => model.setImportJson(event.target.value)}
            placeholder='{"access_token":"...","refresh_token":"..."}'
            className="min-h-40 rounded-2xl px-4 py-3"
          />
        )}

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={model.submitImport}
            disabled={model.isImporting}
            className="h-11 rounded-full px-5"
          >
            {model.isImporting ? 'Importing…' : 'Import Kiro auth'}
          </Button>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h4 className="font-medium">Import social token</h4>
          <p className="text-muted-foreground text-sm">
            Use this only if you already have a refresh token.
          </p>
        </div>
        <Textarea
          value={model.socialRefreshToken}
          onChange={(event) => model.setSocialRefreshToken(event.target.value)}
          placeholder="aorAAAAAG..."
          className="min-h-24 rounded-2xl px-4 py-3"
        />
        <div className="flex justify-end">
          <Button
            type="button"
            onClick={model.submitSocialImport}
            disabled={model.isImportingSocial}
            className="h-11 rounded-full px-5"
          >
            {model.isImportingSocial ? 'Importing…' : 'Import social token'}
          </Button>
        </div>
      </section>
    </div>
  )
}