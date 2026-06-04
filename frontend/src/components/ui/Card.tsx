import type { ReactNode } from 'react'

export function Card({
  children,
  className = '',
  title,
  subtitle,
}: {
  children: ReactNode
  className?: string
  title?: string
  subtitle?: string
}) {
  return (
    <div className={`glass rounded-2xl p-6 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-5">
          {title && <h2 className="text-lg font-semibold text-white">{title}</h2>}
          {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  )
}
