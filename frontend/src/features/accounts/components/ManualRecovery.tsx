import { Button } from '@/components/ui/Button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/Collapsible'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'

import type { AddAccountModel } from '../hooks/useAddAccountModel'

interface ManualRecoveryProps {
  model: AddAccountModel['manual']
  limits: AddAccountModel['limits']
}

export function ManualRecovery({ model, limits }: ManualRecoveryProps) {
  return (
    <section className='space-y-3'>
      <Collapsible open={model.showAdvanced} onOpenChange={model.setShowAdvanced}>
        <div className='flex items-center justify-between gap-3'>
          <div>
            <h3 className='text-base font-semibold'>Manual recovery</h3>
            <p className='text-muted-foreground text-sm'>
              Use this only if sign-in or token import is not an option.
            </p>
          </div>
          <CollapsibleTrigger asChild>
            <Button type='button' variant='outline' className='rounded-full px-5'>
              {model.showAdvanced ? 'Hide' : 'Show'}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className='collapsible-smooth overflow-hidden pt-4'>
          <div className='grid gap-4'>
            <Input
              type='file'
              accept='.json,application/json'
              onChange={model.handleUploadFileChange}
              className='h-11 rounded-2xl file:mr-4 file:border-0 file:bg-transparent file:text-sm file:font-medium'
            />
            {model.uploadFileError ? (
              <p className='text-destructive text-sm'>{model.uploadFileError}</p>
            ) : null}
            <Input
              type='text'
              value={model.uploadName}
              onChange={(event) => model.setUploadName(event.target.value)}
              className='h-11 rounded-2xl'
              placeholder='auth-file.json'
              maxLength={limits.maxUploadNameLength}
            />
            <Textarea
              value={model.uploadBody}
              onChange={(event) => model.setUploadBody(event.target.value)}
              className='min-h-40 rounded-2xl px-4 py-3'
              placeholder='{"type":"antigravity"}'
              maxLength={limits.maxUploadBodyLength}
            />
            <div>
              <Button
                type='button'
                onClick={model.submitUpload}
                disabled={
                  model.isUploading ||
                  model.uploadName.trim().length === 0 ||
                  model.uploadBody.trim().length === 0
                }
                className='h-11 rounded-full px-5'
              >
                {model.isUploading ? 'Uploading…' : 'Upload auth file'}
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  )
}
