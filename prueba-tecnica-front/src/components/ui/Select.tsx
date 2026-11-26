import type { ReactNode, SelectHTMLAttributes } from 'react'

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  error?: string | null
  hint?: ReactNode
  children: ReactNode
}

export function Select({ label, error, hint, id, children, className = '', ...props }: Props) {
  const selectId = id ?? props.name

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm font-medium text-stone-700">
        {label}
      </label>
      <select
        id={selectId}
        className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-stone-900 outline-none ${
          error
            ? 'border-red-400 focus:border-red-500'
            : 'border-stone-300 focus:border-stone-900'
        } ${className}`}
        aria-invalid={Boolean(error)}
        {...props}
      >
        {children}
      </select>
      {error ? <p className="text-xs text-red-600">{error}</p> : hint ? <div>{hint}</div> : null}
    </div>
  )
}
