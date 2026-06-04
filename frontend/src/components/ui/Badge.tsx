type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'accent'

const styles: Record<BadgeVariant, string> = {
  default: 'bg-slate-700/60 text-slate-200',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
  accent: 'bg-accent/15 text-accent-hover',
}

export function Badge({
  children,
  variant = 'default',
}: {
  children: React.ReactNode
  variant?: BadgeVariant
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[variant]}`}
    >
      {children}
    </span>
  )
}
