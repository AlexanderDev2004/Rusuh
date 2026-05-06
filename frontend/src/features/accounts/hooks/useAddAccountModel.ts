import { useEffect, useRef, useState, type ChangeEvent } from 'react'

import { useUploadAuthFileMutation } from '@/apis/auth/files/api'
import {
  useImportKiroMutation,
  useImportKiroSocialMutation,
  useStartKiroBuilderIdMutation,
} from '@/apis/auth/kiro/api'
import {
  useOAuthStatusQuery,
  useStartOAuthMutation,
  useSubmitOAuthCallbackMutation,
} from '@/apis/auth/oauth/api'
import { useStartZedLoginMutation, useZedLoginStatusQuery } from '@/apis/auth/zed/api'
import { toastError, toastInfo, toastSuccess } from '@/components/feedback/toast'
import { buildOAuthTerminalFeedback } from '@/features/accounts/lib/feedback'

import { formatOauthExpiryHint, resolveTrackedOauthSession } from '../lib/oauth'
import type { AddAccountOauthProvider, KiroImportMode, TrackedOauthStates } from '../types'

const MAX_LABEL_LENGTH = 200
const MAX_UPLOAD_NAME_LENGTH = 200
const MAX_UPLOAD_BODY_LENGTH = 20000
const MAX_UPLOAD_FILE_SIZE = 1024 * 1024

function useProviderOauthStatus(state: string | undefined) {
  return useOAuthStatusQuery(state ?? null, Boolean(state))
}

export function useAddAccountModel() {
  const uploadAuthFile = useUploadAuthFileMutation()
  const startOAuth = useStartOAuthMutation()
  const submitOAuthCallback = useSubmitOAuthCallbackMutation()
  const startKiroBuilderId = useStartKiroBuilderIdMutation()
  const startZedLogin = useStartZedLoginMutation()
  const importKiro = useImportKiroMutation()
  const importKiroSocial = useImportKiroSocialMutation()

  const [oauthStates, setOauthStates] = useState<TrackedOauthStates>({})
  const [provider, setProvider] = useState<AddAccountOauthProvider>('kiro')

  const [antigravityLabel, setAntigravityLabel] = useState('')
  const [antigravityAuthUrl, setAntigravityAuthUrl] = useState('')
  const [antigravityCallbackUrl, setAntigravityCallbackUrl] = useState('')

  const [codexLabel, setCodexLabel] = useState('')
  const [codexAuthUrl, setCodexAuthUrl] = useState('')
  const [codexCallbackUrl, setCodexCallbackUrl] = useState('')

  const [zedLabel, setZedLabel] = useState('')
  const [zedLoginUrl, setZedLoginUrl] = useState('')
  const [zedPort, setZedPort] = useState<number | null>(null)
  const [zedSessionId, setZedSessionId] = useState<string | null>(null)

  const [copilotLabel, setCopilotLabel] = useState('')
  const [copilotUserCode, setCopilotUserCode] = useState('')
  const [copilotVerificationUri, setCopilotVerificationUri] = useState('')
  const [copilotExpiresIn, setCopilotExpiresIn] = useState<number | undefined>()

  const [kiroLabel, setKiroLabel] = useState('')
  const [kiroImportMode, setKiroImportMode] = useState<KiroImportMode>('structured')
  const [kiroImportJson, setKiroImportJson] = useState('')
  const [kiroAccessToken, setKiroAccessToken] = useState('')
  const [kiroRefreshToken, setKiroRefreshToken] = useState('')
  const [kiroExpiresAt, setKiroExpiresAt] = useState('')
  const [kiroClientId, setKiroClientId] = useState('')
  const [kiroClientSecret, setKiroClientSecret] = useState('')
  const [kiroProfileArn, setKiroProfileArn] = useState('')
  const [kiroProvider, setKiroProvider] = useState('AWS')
  const [kiroRegion, setKiroRegion] = useState('us-east-1')
  const [kiroStartUrl, setKiroStartUrl] = useState('https://view.awsapps.com/start')
  const [kiroEmail, setKiroEmail] = useState('')
  const [kiroSocialRefreshToken, setKiroSocialRefreshToken] = useState('')

  const [uploadName, setUploadName] = useState('')
  const [uploadBody, setUploadBody] = useState('')
  const [uploadFileError, setUploadFileError] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const kiroOauthState = oauthStates.kiro
  const antigravityOauthState = oauthStates.antigravity
  const codexOauthState = oauthStates.codex
  const copilotOauthState = oauthStates['github-copilot']

  const kiroOauthStatus = useProviderOauthStatus(kiroOauthState)
  const antigravityOauthStatus = useProviderOauthStatus(antigravityOauthState)
  const codexOauthStatus = useProviderOauthStatus(codexOauthState)
  const zedLoginStatus = useZedLoginStatusQuery(zedSessionId, Boolean(zedSessionId))
  const copilotOauthStatus = useProviderOauthStatus(copilotOauthState)

  const oauthStatusByProvider = {
    kiro: kiroOauthStatus,
    antigravity: antigravityOauthStatus,
    codex: codexOauthStatus,
    'github-copilot': copilotOauthStatus,
  } as const

  const activeOauthState = provider === 'zed' ? zedSessionId : oauthStates[provider]
  const activeOauthStatus = provider === 'zed' ? null : oauthStatusByProvider[provider]
  const activeOauthStatusData = activeOauthStatus?.data
  const activeOauthStatusSummary =
    provider === 'zed'
      ? (zedLoginStatus.data?.status ?? (zedLoginStatus.isFetching ? 'waiting' : 'idle'))
      : activeOauthState
        ? (activeOauthStatusData?.status ?? (activeOauthStatus?.isFetching ? 'wait' : 'idle'))
        : 'idle'
  const copilotExpiryHint = formatOauthExpiryHint(copilotExpiresIn)
  const lastNotifiedOauthStates = useRef<Partial<Record<AddAccountOauthProvider, string>>>({})
  const lastNotifiedZedSessionId = useRef<string | null>(null)

  useEffect(() => {
    const providerStatuses = {
      kiro: {
        status: kiroOauthStatus.data?.status,
        error: kiroOauthStatus.data?.error,
      },
      antigravity: {
        status: antigravityOauthStatus.data?.status,
        error: antigravityOauthStatus.data?.error,
      },
      codex: {
        status: codexOauthStatus.data?.status,
        error: codexOauthStatus.data?.error,
      },
      'github-copilot': {
        status: copilotOauthStatus.data?.status,
        error: copilotOauthStatus.data?.error,
      },
    } as const

    const trackedProviders: Array<Exclude<AddAccountOauthProvider, 'zed'>> = [
      'kiro',
      'antigravity',
      'codex',
      'github-copilot',
    ]

    for (const trackedProvider of trackedProviders) {
      const trackedState = oauthStates[trackedProvider]
      const trackedStatus = providerStatuses[trackedProvider].status
      const trackedError = providerStatuses[trackedProvider].error

      if (!trackedState || !trackedStatus || trackedStatus === 'wait') {
        continue
      }

      if (lastNotifiedOauthStates.current[trackedProvider] === trackedState) {
        continue
      }

      const feedback = buildOAuthTerminalFeedback(trackedStatus, trackedError)
      if (!feedback) {
        continue
      }

      if (feedback.type === 'success') {
        toastSuccess(feedback.title, feedback.detail)
      } else {
        toastError(feedback.title, feedback.detail)
      }

      lastNotifiedOauthStates.current[trackedProvider] = trackedState
    }
  }, [
    oauthStates,
    kiroOauthStatus.data?.status,
    kiroOauthStatus.data?.error,
    antigravityOauthStatus.data?.status,
    antigravityOauthStatus.data?.error,
    codexOauthStatus.data?.status,
    codexOauthStatus.data?.error,
    copilotOauthStatus.data?.status,
    copilotOauthStatus.data?.error,
  ])

  useEffect(() => {
    if (!zedSessionId || !zedLoginStatus.data?.status || zedLoginStatus.data.status === 'waiting') {
      return
    }

    if (lastNotifiedZedSessionId.current === zedSessionId) {
      return
    }

    toastSuccess('Zed login complete', 'Account connected. Open Accounts to review it.')
    lastNotifiedZedSessionId.current = zedSessionId
  }, [zedSessionId, zedLoginStatus.data?.status])

  function submitKiroStructuredImport() {
    importKiro.mutate(
      {
        access_token: kiroAccessToken.trim(),
        refresh_token: kiroRefreshToken.trim(),
        expires_at: kiroExpiresAt.trim(),
        client_id: kiroClientId.trim(),
        client_secret: kiroClientSecret.trim(),
        profile_arn: kiroProfileArn.trim(),
        auth_method: 'import',
        provider: kiroProvider.trim() || 'AWS',
        region: kiroRegion.trim() || 'us-east-1',
        start_url: kiroStartUrl.trim(),
        email: kiroEmail.trim(),
        label: kiroLabel.trim(),
      },
      {
        onSuccess: () => {
          toastSuccess('Kiro account added', 'Open Accounts to review it.')
        },
        onError: (error) => {
          toastError('Could not add the Kiro account', error.message)
        },
      },
    )
  }

  function submitKiroJsonImport() {
    const parsed = JSON.parse(kiroImportJson) as Record<string, unknown>
    importKiro.mutate(
      {
        access_token: String(parsed.access_token ?? ''),
        refresh_token: String(parsed.refresh_token ?? ''),
        expires_at: String(parsed.expires_at ?? ''),
        client_id: String(parsed.client_id ?? ''),
        client_secret: String(parsed.client_secret ?? ''),
        profile_arn: String(parsed.profile_arn ?? ''),
        auth_method: typeof parsed.auth_method === 'string' ? parsed.auth_method : 'import',
        provider: typeof parsed.provider === 'string' ? parsed.provider : 'AWS',
        region: typeof parsed.region === 'string' ? parsed.region : 'us-east-1',
        start_url: typeof parsed.start_url === 'string' ? parsed.start_url : '',
        email: typeof parsed.email === 'string' ? parsed.email : '',
        label: kiroLabel.trim(),
      },
      {
        onSuccess: () => {
          toastSuccess('Kiro account added', 'Open Accounts to review it.')
        },
        onError: (error) => {
          toastError('Could not add the Kiro account', error.message)
        },
      },
    )
  }

  function submitKiroImport() {
    try {
      if (kiroImportMode === 'json') {
        submitKiroJsonImport()
        return
      }
      submitKiroStructuredImport()
    } catch (error) {
      toastError(
        'Could not read the JSON',
        error instanceof Error ? error.message : 'Check the JSON and try again.',
      )
    }
  }

  function submitKiroSocialImport() {
    importKiroSocial.mutate(
      {
        refresh_token: kiroSocialRefreshToken.trim(),
        label: kiroLabel.trim() || undefined,
      },
      {
        onSuccess: () => {
          toastSuccess('Kiro account added', 'Open Accounts to review it.')
        },
        onError: (error) => {
          toastError('Could not add the Kiro account', error.message)
        },
      },
    )
  }

  function startKiroBuilderFlow() {
    startKiroBuilderId.mutate(
      { label: kiroLabel.trim() || undefined },
      {
        onSuccess: (data) => {
          setOauthStates((prev) => ({ ...prev, kiro: data.session_id }))
          toastSuccess('Kiro sign-in started', 'Finish the flow, then open Accounts.')
          window.open(data.auth_url, '_blank', 'noopener,noreferrer')
        },
        onError: (error) => {
          toastError('Could not start Kiro sign-in', error.message)
        },
      },
    )
  }

  function startAntigravityOauth() {
    startOAuth.mutate(
      {
        provider: 'antigravity',
        label: antigravityLabel.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          setOauthStates((prev) => ({
            ...prev,
            [data.provider as AddAccountOauthProvider]: data.state,
          }))
          setAntigravityAuthUrl(data.url ?? '')
          toastSuccess(
            'Antigravity OAuth link ready',
            'Open the link, login, then paste localhost callback URL below.',
          )
        },
        onError: (error) => {
          toastError('Could not start Antigravity sign-in', error.message)
        },
      },
    )
  }

  function startCodexOauth() {
    startOAuth.mutate(
      {
        provider: 'codex',
        label: codexLabel.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          setOauthStates((prev) => ({
            ...prev,
            [data.provider as AddAccountOauthProvider]: data.state,
          }))
          setCodexAuthUrl(data.url ?? '')
          toastSuccess(
            'Codex OAuth link ready',
            'Open the link, login, then paste localhost callback URL below.',
          )
        },
        onError: (error) => {
          toastError('Could not start Codex sign-in', error.message)
        },
      },
    )
  }

  function startCopilotOauth() {
    startOAuth.mutate(
      {
        provider: 'github-copilot',
        label: copilotLabel.trim() || undefined,
      },
      {
        onSuccess: (data) => {
          setOauthStates((prev) => ({
            ...prev,
            'github-copilot': data.state,
          }))
          setCopilotUserCode(data.user_code ?? '')
          setCopilotVerificationUri(data.verification_uri ?? '')
          setCopilotExpiresIn(data.expires_in)
          toastSuccess('GitHub Copilot sign-in started', 'Open GitHub and enter the device code.')
        },
        onError: (error) => {
          toastError('Could not start GitHub Copilot sign-in', error.message)
        },
      },
    )
  }

  function startZedFlow() {
    startZedLogin.mutate(
      { name: zedLabel.trim() || undefined },
      {
        onSuccess: (data) => {
          setZedSessionId(data.session_id)
          setZedLoginUrl(data.login_url)
          setZedPort(data.port)
          toastSuccess('Zed login started', 'Open the login link and finish the native-app flow.')
          window.open(data.login_url, '_blank', 'noopener,noreferrer')
        },
        onError: (error) => {
          toastError('Could not start Zed sign-in', error.message)
        },
      },
    )
  }

  function submitAntigravityCallback() {
    const trackedSession = resolveTrackedOauthSession(
      'antigravity',
      antigravityCallbackUrl,
      oauthStates,
    )

    submitOAuthCallback.mutate(
      {
        provider: 'antigravity',
        redirectUrl: antigravityCallbackUrl,
      },
      {
        onSuccess: () => {
          if (trackedSession) {
            setOauthStates((prev) => ({
              ...prev,
              [trackedSession.provider]: trackedSession.state,
            }))
          }
          toastSuccess('Callback submitted', 'Polling OAuth status...')
        },
        onError: (error) => {
          toastError('Could not submit callback URL', error.message)
        },
      },
    )
  }

  function submitCodexCallback() {
    const trackedSession = resolveTrackedOauthSession('codex', codexCallbackUrl, oauthStates)

    submitOAuthCallback.mutate(
      {
        provider: 'codex',
        redirectUrl: codexCallbackUrl,
      },
      {
        onSuccess: () => {
          if (trackedSession) {
            setOauthStates((prev) => ({
              ...prev,
              [trackedSession.provider]: trackedSession.state,
            }))
          }
          toastSuccess('Callback submitted', 'Polling OAuth status...')
        },
        onError: (error) => {
          toastError('Could not submit callback URL', error.message)
        },
      },
    )
  }

  async function handleUploadFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.currentTarget.value = ''

    if (!file) return
    if (file.size > MAX_UPLOAD_FILE_SIZE) {
      setUploadFileError('JSON file too large. Max 1 MB.')
      toastError('JSON file too large', 'Max 1 MB.')
      return
    }

    setUploadFileError(null)

    try {
      const body = await file.text()
      const nextName = file.name.slice(0, MAX_UPLOAD_NAME_LENGTH)
      const nextBody = body.slice(0, MAX_UPLOAD_BODY_LENGTH)
      setUploadName(nextName)
      setUploadBody(nextBody)
      setUploadFileError(
        body.length > MAX_UPLOAD_BODY_LENGTH
          ? `File truncated to ${MAX_UPLOAD_BODY_LENGTH.toLocaleString()} characters.`
          : null,
      )
      if (body.length > MAX_UPLOAD_BODY_LENGTH) {
        toastInfo(
          'File truncated',
          `Limited to ${MAX_UPLOAD_BODY_LENGTH.toLocaleString()} characters.`,
        )
      }

      if (nextName.trim().length === 0 || nextBody.trim().length === 0) {
        setUploadFileError('Selected JSON file is empty.')
        toastError('Selected JSON file is empty')
        return
      }

      uploadAuthFile.mutate(
        { name: nextName.trim(), body: nextBody.trim() },
        {
          onSuccess: () => {
            toastSuccess('Auth file uploaded', 'Open Accounts to review it.')
          },
          onError: (error) => {
            toastError('Failed to upload auth file', error.message)
          },
        },
      )
    } catch {
      setUploadFileError('Failed to read selected JSON file.')
      toastError('Failed to read selected JSON file')
    }
  }

  function submitManualUpload() {
    uploadAuthFile.mutate(
      { name: uploadName.trim(), body: uploadBody.trim() },
      {
        onSuccess: () => {
          toastSuccess('Auth file uploaded', 'Open Accounts to review it.')
        },
        onError: (error) => {
          toastError('Failed to upload auth file', error.message)
        },
      },
    )
  }

  return {
    limits: {
      maxLabelLength: MAX_LABEL_LENGTH,
      maxUploadNameLength: MAX_UPLOAD_NAME_LENGTH,
      maxUploadBodyLength: MAX_UPLOAD_BODY_LENGTH,
    },
    provider,
    setProvider,
    activeOauthState,
    activeOauthStatusSummary,
    activeOauthStatusData,
    kiro: {
      label: kiroLabel,
      setLabel: setKiroLabel,
      importMode: kiroImportMode,
      setImportMode: setKiroImportMode,
      importJson: kiroImportJson,
      setImportJson: setKiroImportJson,
      accessToken: kiroAccessToken,
      setAccessToken: setKiroAccessToken,
      refreshToken: kiroRefreshToken,
      setRefreshToken: setKiroRefreshToken,
      expiresAt: kiroExpiresAt,
      setExpiresAt: setKiroExpiresAt,
      clientId: kiroClientId,
      setClientId: setKiroClientId,
      clientSecret: kiroClientSecret,
      setClientSecret: setKiroClientSecret,
      profileArn: kiroProfileArn,
      setProfileArn: setKiroProfileArn,
      provider: kiroProvider,
      setProvider: setKiroProvider,
      region: kiroRegion,
      setRegion: setKiroRegion,
      startUrl: kiroStartUrl,
      setStartUrl: setKiroStartUrl,
      email: kiroEmail,
      setEmail: setKiroEmail,
      socialRefreshToken: kiroSocialRefreshToken,
      setSocialRefreshToken: setKiroSocialRefreshToken,
      startBuilderFlow: startKiroBuilderFlow,
      submitImport: submitKiroImport,
      submitSocialImport: submitKiroSocialImport,
      isStartingBuilderId: startKiroBuilderId.isPending,
      isImporting: importKiro.isPending,
      isImportingSocial: importKiroSocial.isPending,
    },
    antigravity: {
      label: antigravityLabel,
      setLabel: setAntigravityLabel,
      authUrl: antigravityAuthUrl,
      callbackUrl: antigravityCallbackUrl,
      setCallbackUrl: setAntigravityCallbackUrl,
      startOauth: startAntigravityOauth,
      submitCallback: submitAntigravityCallback,
      isStartingOauth: startOAuth.isPending,
      isSubmittingCallback: submitOAuthCallback.isPending,
    },
    codex: {
      label: codexLabel,
      setLabel: setCodexLabel,
      authUrl: codexAuthUrl,
      callbackUrl: codexCallbackUrl,
      setCallbackUrl: setCodexCallbackUrl,
      startOauth: startCodexOauth,
      submitCallback: submitCodexCallback,
      isStartingOauth: startOAuth.isPending,
      isSubmittingCallback: submitOAuthCallback.isPending,
    },
    zed: {
      label: zedLabel,
      setLabel: setZedLabel,
      loginUrl: zedLoginUrl,
      port: zedPort,
      statusData: zedLoginStatus.data,
      statusError: zedLoginStatus.error,
      startLogin: startZedFlow,
      isStartingLogin: startZedLogin.isPending,
    },
    copilot: {
      label: copilotLabel,
      setLabel: setCopilotLabel,
      userCode: copilotUserCode,
      verificationUri: copilotVerificationUri,
      expiryHint: copilotExpiryHint,
      startOauth: startCopilotOauth,
      isStartingOauth: startOAuth.isPending,
    },
    manual: {
      showAdvanced,
      setShowAdvanced,
      uploadName,
      setUploadName,
      uploadBody,
      setUploadBody,
      uploadFileError,
      handleUploadFileChange,
      submitUpload: submitManualUpload,
      isUploading: uploadAuthFile.isPending,
    },
  }
}

export type AddAccountModel = ReturnType<typeof useAddAccountModel>
