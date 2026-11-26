import { useEffect, type ReactNode } from 'react'

type Props = {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}

export function Modal({ open, title, onClose, children, wide = false }: Props) {
  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-stone-900/30 p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Cerrar"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={`relative z-10 w-full rounded-lg border border-stone-200 bg-white shadow-sm ${wide ? 'max-w-2xl' : 'max-w-md'}`}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-3.5">
          <h2 id="modal-title" className="text-sm font-semibold text-stone-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-1.5 text-lg leading-none text-stone-400 hover:bg-stone-100 hover:text-stone-700"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <div className="px-5 py-5">{children}</div>
      </div>
    </div>
  )
}
