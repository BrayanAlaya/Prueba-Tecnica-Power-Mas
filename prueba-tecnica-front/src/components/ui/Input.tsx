import type { InputHTMLAttributes, ReactNode } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string | null
  hint?: ReactNode
  trailing?: ReactNode
}

export function Input({ label, error, hint, trailing, id, className = '', ...props }: Props) {
  const inputId = id ?? props.name

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-stone-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          className={`w-full rounded-md border bg-white px-3 py-2 text-sm text-stone-900 outline-none placeholder:text-stone-400 ${
            error
              ? 'border-red-400 focus:border-red-500'
              : 'border-stone-300 focus:border-stone-900'
          } ${trailing ? 'pr-12' : ''} ${className}`}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {trailing ? (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-stone-400">
            {trailing}
          </span>
        ) : null}
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : hint ? <div>{hint}</div> : null}
    </div>
  )
}
