type Props = {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) {
    return null
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav aria-label="Paginación" className="flex flex-wrap items-center gap-1">
      <button
        type="button"
        className="rounded-md px-2.5 py-1.5 text-sm text-stone-600 hover:bg-stone-100 disabled:text-stone-300"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Anterior
      </button>
      {pages.map((numero) => (
        <button
          key={numero}
          type="button"
          aria-current={numero === page ? 'page' : undefined}
          className={`min-w-8 rounded-md px-2.5 py-1.5 text-sm ${
            numero === page
              ? 'bg-stone-900 text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
          onClick={() => onChange(numero)}
        >
          {numero}
        </button>
      ))}
      <button
        type="button"
        className="rounded-md px-2.5 py-1.5 text-sm text-stone-600 hover:bg-stone-100 disabled:text-stone-300"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      >
        Siguiente
      </button>
    </nav>
  )
}
