import { useForm } from '@tanstack/react-form'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

import { apiKeyFormSchema, MAX_KEY_LENGTH } from '../types'

export type ApiKeyFormProps = {
  isPending: boolean
  onSubmit: (value: string) => void
}

export function ApiKeyForm({ isPending, onSubmit }: ApiKeyFormProps) {
  const form = useForm({
    defaultValues: {
      value: '',
    },
    validators: {
      onSubmit: apiKeyFormSchema,
    },
    onSubmit: ({ value }) => {
      onSubmit(value.value)
      form.reset()
    },
  })

  return (
    <section className='space-y-3'>
      <div>
        <h3 className='text-lg font-semibold'>Create key</h3>
        <p className='text-muted-foreground mt-1 text-sm'>Add a label, then generate a key.</p>
      </div>
      <div className='dashboard-panel rounded-2xl p-5'>
        <form
          className='grid gap-3'
          onSubmit={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void form.handleSubmit()
          }}
        >
          <form.Field name='value'>
            {(field) => (
              <label className='space-y-2 text-sm'>
                <span className='text-muted-foreground'>Key label</span>
                <Input
                  type='text'
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  className='border-border text-foreground bg-background/70 h-11 rounded-2xl px-4'
                  placeholder='e.g. Production API'
                  maxLength={MAX_KEY_LENGTH}
                />
                {field.state.meta.errors.length > 0 ? (
                  <span className='text-destructive text-xs'>
                    {field.state.meta.errors[0]?.message}
                  </span>
                ) : null}
              </label>
            )}
          </form.Field>
          <p className='text-muted-foreground text-xs'>
            Use a short label so it is easy to find later.
          </p>
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type='submit'
                disabled={!canSubmit || isSubmitting || isPending}
                className='h-11 rounded-full px-5'
              >
                {isPending ? 'Generating…' : 'Generate key'}
              </Button>
            )}
          </form.Subscribe>
        </form>
      </div>
    </section>
  )
}
