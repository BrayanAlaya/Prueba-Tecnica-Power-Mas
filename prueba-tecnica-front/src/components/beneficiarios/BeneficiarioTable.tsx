import type { Beneficiario } from '../../types'
import { calcularEdad, formatearFecha } from '../../utils/documentoValidation'

type Props = {
  beneficiarios: Beneficiario[]
  loading: boolean
  onEdit: (beneficiario: Beneficiario) => void
  onDelete: (beneficiario: Beneficiario) => void
}

export function BeneficiarioTable({ beneficiarios, loading, onEdit, onDelete }: Props) {
  if (loading) {
    return <p className="px-4 py-8 text-sm text-stone-500">Cargando...</p>
  }

  if (beneficiarios.length === 0) {
    return <p className="px-4 py-8 text-sm text-stone-500">No hay beneficiarios para mostrar.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-stone-200 text-xs font-medium uppercase tracking-wide text-stone-500">
            <th className="px-4 py-3">Beneficiario</th>
            <th className="px-4 py-3">Documento</th>
            <th className="px-4 py-3">País</th>
            <th className="px-4 py-3">Nacimiento</th>
            <th className="px-4 py-3">Sexo</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {beneficiarios.map((beneficiario) => (
            <tr key={beneficiario.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
              <td className="px-4 py-3 font-medium text-stone-900">
                {beneficiario.nombres} {beneficiario.apellidos}
              </td>
              <td className="px-4 py-3 text-stone-600">
                {beneficiario.documentoAbreviatura} {beneficiario.numeroDocumento}
              </td>
              <td className="px-4 py-3 text-stone-600">{beneficiario.documentoPais}</td>
              <td className="px-4 py-3 text-stone-600">
                {formatearFecha(beneficiario.fechaNacimiento)}
                <span className="text-stone-400"> ({calcularEdad(beneficiario.fechaNacimiento)} años)</span>
              </td>
              <td className="px-4 py-3 text-stone-600">
                {beneficiario.sexo === 'F' ? 'Femenino' : 'Masculino'}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  type="button"
                  className="text-sm text-stone-600 hover:text-stone-900"
                  onClick={() => onEdit(beneficiario)}
                >
                  Editar
                </button>
                <span className="mx-2 text-stone-300">·</span>
                <button
                  type="button"
                  className="text-sm text-stone-600 hover:text-red-700"
                  onClick={() => onDelete(beneficiario)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
