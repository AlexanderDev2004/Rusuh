export const STATUS_TONE: Record<string, string> = {
  active: 'border-primary/35 bg-primary/10 text-primary',
  refreshing: 'border-secondary/35 bg-secondary/10 text-foreground',
  pending: 'border-accent/35 bg-accent/20 text-accent-foreground',
  error:
    'border-destructive/40 bg-destructive/10 text-destructive dark:text-destructive-foreground',
  disabled: 'border-border bg-muted text-muted-foreground',
  unknown: 'border-border bg-muted text-muted-foreground',
}
export function statusTone(status: string) {
  return STATUS_TONE[status] ?? 'border-border bg-muted text-muted-foreground'
}
