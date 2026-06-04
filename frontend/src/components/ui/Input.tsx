import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface FieldProps {
  label: string
  error?: string
  hint?: string
}

export function Input({
  label,
  error,
  hint,
  className = '',
  id,
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <input
        id={fieldId}
        className={`w-full rounded-xl border bg-surface-elevated px-4 py-2.5 text-white placeholder:text-slate-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 ${
          error ? 'border-danger/50' : 'border-border'
        } ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

export function Textarea({
  label,
  error,
  hint,
  className = '',
  id,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="space-y-1.5">
      <label htmlFor={fieldId} className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <textarea
        id={fieldId}
        className={`min-h-[120px] w-full resize-y rounded-xl border bg-surface-elevated px-4 py-2.5 text-white placeholder:text-slate-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20 ${
          error ? 'border-danger/50' : 'border-border'
        } ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}
