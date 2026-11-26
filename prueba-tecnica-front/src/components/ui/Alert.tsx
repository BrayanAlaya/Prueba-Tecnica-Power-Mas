type Props = {
  type: 'success' | 'error'
  message: string
  onClose: () => void
}

export function Alert({ type, message, onClose }: Props) {
  return (
    <div
      role="status"
      className={`flex items-start justify-between gap-3 rounded-md border px-3 py-2.5 text-sm ${
        type === 'success'
          ? 'border-stone-200 bg-white text-stone-700'
          : 'border-red-200 bg-red-50 text-red-800'
      }`}
    >
      <p>{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 text-base leading-none text-stone-400 hover:text-stone-700"
        aria-label="Cerrar aviso"
      >
        ×
      </button>
    </div>
  )
}
