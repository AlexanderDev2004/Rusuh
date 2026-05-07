import { useState, type ChangeEvent } from 'react'

import { useUploadAuthFileMutation } from '@/apis/auth/files/api'
import { toastError, toastInfo, toastSuccess } from '@/components/feedback/toast'

import { ACCOUNT_LIMITS } from './useAddAccountBase'

export interface UseManualModelReturn {
  showAdvanced: boolean
  setShowAdvanced: (show: boolean) => void
  uploadName: string
  setUploadName: (name: string) => void
  uploadBody: string
  setUploadBody: (body: string) => void
  uploadFileError: string | null
  handleUploadFileChange: (event: ChangeEvent<HTMLInputElement>) => Promise<void>
  submitUpload: () => void
  isUploading: boolean
}

export function useManualModel(): UseManualModelReturn {
  const uploadAuthFile = useUploadAuthFileMutation()

  const [showAdvanced, setShowAdvanced] = useState(false)
  const [uploadName, setUploadName] = useState('')
  const [uploadBody, setUploadBody] = useState('')
  const [uploadFileError, setUploadFileError] = useState<string | null>(null)

  async function handleUploadFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.currentTarget.value = ''

    if (!file) return
    if (file.size > ACCOUNT_LIMITS.maxUploadFileSize) {
      setUploadFileError('JSON file too large. Max 1 MB.')
      toastError('JSON file too large', 'Max 1 MB.')
      return
    }

    setUploadFileError(null)

    try {
      const body = await file.text()
      const nextName = file.name.slice(0, ACCOUNT_LIMITS.maxUploadNameLength)
      const nextBody = body.slice(0, ACCOUNT_LIMITS.maxUploadBodyLength)
      setUploadName(nextName)
      setUploadBody(nextBody)
      setUploadFileError(
        body.length > ACCOUNT_LIMITS.maxUploadBodyLength
          ? `File truncated to ${ACCOUNT_LIMITS.maxUploadBodyLength.toLocaleString()} characters.`
          : null,
      )
      if (body.length > ACCOUNT_LIMITS.maxUploadBodyLength) {
        toastInfo(
          'File truncated',
          `Limited to ${ACCOUNT_LIMITS.maxUploadBodyLength.toLocaleString()} characters.`,
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

  function submitUpload() {
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
    showAdvanced,
    setShowAdvanced,
    uploadName,
    setUploadName,
    uploadBody,
    setUploadBody,
    uploadFileError,
    handleUploadFileChange,
    submitUpload,
    isUploading: uploadAuthFile.isPending,
  }
}

export type ManualModel = ReturnType<typeof useManualModel>
