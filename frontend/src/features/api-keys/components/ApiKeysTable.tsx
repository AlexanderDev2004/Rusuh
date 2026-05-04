import { Copy, Eye, EyeOff, RotateCw, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { toastSuccess } from '@/components/feedback/toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/AlertDialog'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'

import { MAX_KEY_LENGTH } from '../types'

export type ApiKeysTableProps = {
  items: string[]
  deletePending: boolean
  replacePending: boolean
  onDelete: (index: number) => void
  onReplace: (input: { index: number; value: string }) => void
}

function maskKey(value: string) {
  if (value.length <= 10) return '••••••••'
  return `${value.slice(0, 4)}••••••••${value.slice(-6)}`
}

async function copyKey(value: string) {
  await navigator.clipboard.writeText(value)
  toastSuccess('API key copied', 'Paste it into your client config.')
}

export function ApiKeysTable({
  items,
  deletePending,
  replacePending,
  onDelete,
  onReplace,
}: ApiKeysTableProps) {
  const [replaceValue, setReplaceValue] = useState('')
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null)
  const [revealed, setRevealed] = useState<Set<number>>(() => new Set())
  const hasKeys = items.length > 0

  const toggleReveal = (index: number) => {
    setRevealed((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <section className='dashboard-panel overflow-hidden rounded-3xl'>
      <div className='border-border flex flex-col gap-2 border-b p-5 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Active keys</h3>
          <p className='text-muted-foreground mt-1 text-sm'>
            Show only when needed, then copy the secret into your client.
          </p>
        </div>
        <Badge variant='outline' className='w-fit rounded-full px-3 py-1 text-xs'>
          {hasKeys ? 'Ready to copy' : 'No keys yet'}
        </Badge>
      </div>

      {!hasKeys ? (
        <div className='text-muted-foreground p-5 text-sm'>
          No API keys yet. Generate one key to let clients connect to the proxy.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Secret</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => {
              const isRevealed = revealed.has(index)
              return (
                <TableRow key={`${item}-${index}`}>
                  <TableCell>
                    <div>
                      <p className='text-foreground text-sm font-semibold'>Key #{index + 1}</p>
                      <code className='text-muted-foreground mt-1 block max-w-[28rem] truncate font-mono text-xs'>
                        {isRevealed ? item : maskKey(item)}
                      </code>
                    </div>
                    {replaceIndex === index ? (
                      <div className='mt-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_auto]'>
                        <Input
                          type='text'
                          value={replaceValue}
                          onChange={(event) => setReplaceValue(event.target.value)}
                          className='border-border text-foreground bg-background/70 h-11 rounded-2xl font-mono text-xs'
                          maxLength={MAX_KEY_LENGTH}
                        />
                        <Button
                          type='button'
                          onClick={() => onReplace({ index, value: replaceValue })}
                          disabled={replacePending || replaceValue.trim().length === 0}
                          className='h-11 rounded-full px-5'
                        >
                          Save
                        </Button>
                        <Button
                          type='button'
                          variant='outline'
                          onClick={() => {
                            setReplaceIndex(null)
                            setReplaceValue('')
                          }}
                          className='h-11 rounded-full px-5'
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : null}
                  </TableCell>
                  <TableCell>
                    <Badge variant='outline' className='rounded-full px-2.5 py-1 text-xs'>
                      Ready
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className='flex justify-end gap-1.5'>
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => toggleReveal(index)}
                        className='h-9 w-9 rounded-xl'
                        title={isRevealed ? 'Hide secret' : 'Show secret'}
                      >
                        {isRevealed ? <EyeOff className='size-4' /> : <Eye className='size-4' />}
                        <span className='sr-only'>
                          {isRevealed ? 'Hide secret' : 'Show secret'}
                        </span>
                      </Button>
                      <Button
                        type='button'
                        size='icon'
                        onClick={() => void copyKey(item)}
                        className='h-9 w-9 rounded-xl'
                        title='Copy secret'
                      >
                        <Copy className='size-4' />
                        <span className='sr-only'>Copy secret</span>
                      </Button>
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => {
                          setReplaceIndex(index)
                          setReplaceValue(item)
                        }}
                        className='h-9 w-9 rounded-xl'
                        title='Replace key'
                      >
                        <RotateCw className='size-4' />
                        <span className='sr-only'>Replace key</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type='button'
                            variant='destructive'
                            size='icon'
                            disabled={deletePending}
                            className='h-9 w-9 rounded-xl'
                            title='Delete key'
                          >
                            <Trash2 className='size-4' />
                            <span className='sr-only'>Delete key</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className='rounded-3xl'>
                          <AlertDialogHeader>
                            <AlertDialogMedia>
                              <Trash2 className='size-5' />
                            </AlertDialogMedia>
                            <AlertDialogTitle>Delete API key?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Key #{index + 1} will stop authenticating clients immediately.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className='rounded-full px-5'>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              variant='destructive'
                              className='rounded-full px-5'
                              onClick={() => onDelete(index)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </section>
  )
}
