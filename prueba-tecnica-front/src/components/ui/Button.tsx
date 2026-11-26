import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

const styles: Record<Variant, string> = {
  primary:
    'bg-stone-900 text-white hover:bg-stone-800 disabled:bg-stone-300',
  secondary:
    'border border-stone-300 bg-white text-stone-800 hover:bg-stone-50',
  danger:
    'border border-stone-300 bg-white text-red-700 hover:bg-red-50',
  ghost: 'text-stone-600 hover:text-stone-900 hover:bg-stone-100',
}

export function Button({ variant = 'primary', className = '', children, ...props }: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-3.5 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
