import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

type AlertType = 'error' | 'success' | 'info'

const config: Record<
  AlertType,
  { icon: typeof AlertCircle; className: string }
> = {
  error: { icon: AlertCircle, className: 'border-danger/30 bg-danger/10 text-red-200' },
  success: {
    icon: CheckCircle2,
    className: 'border-success/30 bg-success/10 text-emerald-200',
  },
  info: { icon: Info, className: 'border-accent/30 bg-accent/10 text-indigo-200' },
}

export function Alert({
  type = 'info',
  message,
}: {
  type?: AlertType
  message: string
}) {
  const { icon: Icon, className } = config[type]

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${className}`}
      role="alert"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  )
}
