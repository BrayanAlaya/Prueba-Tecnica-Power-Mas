import type { Beneficiario } from '../../types'
import { Button } from '../ui/Button'

type Props = {
  beneficiario: Beneficiario
  submitting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirm({ beneficiario, submitting, onConfirm, onCancel }: Props) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-stone-600">
        ¿Desea eliminar a{' '}
        <strong className="font-medium text-stone-900">
          {beneficiario.nombres} {beneficiario.apellidos}
        </strong>{' '}
        ({beneficiario.documentoAbreviatura} {beneficiario.numeroDocumento})? Esta acción no se puede
        deshacer.
      </p>
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="button" variant="danger" onClick={onConfirm} disabled={submitting}>
          {submitting ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </div>
    </div>
  )
}
