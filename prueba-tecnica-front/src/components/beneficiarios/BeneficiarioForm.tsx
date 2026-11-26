import { useMemo, useState, type FormEvent } from 'react'
import type { Beneficiario, BeneficiarioPayload, DocumentoIdentidad } from '../../types'
import {
  filtrarNumeroDocumento,
  hintDocumento,
  validarNumeroDocumento,
} from '../../utils/documentoValidation'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

type FormValues = {
  nombres: string
  apellidos: string
  documentoIdentidadId: string
  numeroDocumento: string
  fechaNacimiento: string
  sexo: string
}

type FormErrors = Partial<Record<keyof FormValues, string>>

type Props = {
  documentos: DocumentoIdentidad[]
  initial?: Beneficiario | null
  submitting: boolean
  onSubmit: (payload: BeneficiarioPayload) => Promise<void>
  onCancel: () => void
}

const emptyForm: FormValues = {
  nombres: '',
  apellidos: '',
  documentoIdentidadId: '',
  numeroDocumento: '',
  fechaNacimiento: '',
  sexo: '',
}

function toFormValues(beneficiario?: Beneficiario | null): FormValues {
  if (!beneficiario) {
    return emptyForm
  }

  return {
    nombres: beneficiario.nombres,
    apellidos: beneficiario.apellidos,
    documentoIdentidadId: String(beneficiario.documentoIdentidadId),
    numeroDocumento: beneficiario.numeroDocumento,
    fechaNacimiento: beneficiario.fechaNacimiento.slice(0, 10),
    sexo: beneficiario.sexo,
  }
}

function groupByPais(documentos: DocumentoIdentidad[]) {
  return documentos.reduce<Record<string, DocumentoIdentidad[]>>((acc, documento) => {
    acc[documento.pais] ??= []
    acc[documento.pais].push(documento)
    return acc
  }, {})
}

export function BeneficiarioForm({ documentos, initial, submitting, onSubmit, onCancel }: Props) {
  const [values, setValues] = useState<FormValues>(() => toFormValues(initial))
  const [errors, setErrors] = useState<FormErrors>({})
  const [touchedNumero, setTouchedNumero] = useState(false)

  const documento = useMemo(
    () => documentos.find((item) => item.id === Number(values.documentoIdentidadId)),
    [documentos, values.documentoIdentidadId],
  )

  const documentosPorPais = useMemo(() => groupByPais(documentos), [documentos])
  const errorNumero = validarNumeroDocumento(values.numeroDocumento, documento)

  function setField<K extends keyof FormValues>(field: K, value: FormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
  }

  function validate(): FormErrors {
    const next: FormErrors = {}

    if (!values.nombres.trim()) next.nombres = 'Los nombres son obligatorios.'
    if (!values.apellidos.trim()) next.apellidos = 'Los apellidos son obligatorios.'
    if (!values.documentoIdentidadId) next.documentoIdentidadId = 'Seleccione un tipo de documento.'
    if (errorNumero) next.numeroDocumento = errorNumero
    if (!values.fechaNacimiento) {
      next.fechaNacimiento = 'La fecha de nacimiento es obligatoria.'
    } else if (new Date(`${values.fechaNacimiento}T00:00:00`) > new Date()) {
      next.fechaNacimiento = 'La fecha de nacimiento no puede ser futura.'
    }
    if (values.sexo !== 'M' && values.sexo !== 'F') next.sexo = 'Seleccione el sexo.'

    return next
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setTouchedNumero(true)

    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0 || !documento) {
      return
    }

    await onSubmit({
      nombres: values.nombres.trim(),
      apellidos: values.apellidos.trim(),
      documentoIdentidadId: documento.id,
      numeroDocumento: values.numeroDocumento.trim(),
      fechaNacimiento: values.fechaNacimiento,
      sexo: values.sexo as 'M' | 'F',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nombres"
          name="nombres"
          value={values.nombres}
          onChange={(event) => setField('nombres', event.target.value)}
          error={errors.nombres}
          maxLength={100}
          autoComplete="given-name"
        />
        <Input
          label="Apellidos"
          name="apellidos"
          value={values.apellidos}
          onChange={(event) => setField('apellidos', event.target.value)}
          error={errors.apellidos}
          maxLength={100}
          autoComplete="family-name"
        />
      </div>

      <Select
        label="Tipo de documento"
        name="documentoIdentidadId"
        value={values.documentoIdentidadId}
        onChange={(event) => {
          setField('documentoIdentidadId', event.target.value)
          setField('numeroDocumento', '')
          setTouchedNumero(false)
        }}
        error={errors.documentoIdentidadId}
        hint={
          documento ? (
            <p className="text-xs text-stone-500">{hintDocumento(documento)}</p>
          ) : (
            <p className="text-xs text-stone-400">
              El formato del número se ajusta al documento y país seleccionados.
            </p>
          )
        }
      >
        <option value="">Seleccione un documento</option>
        {Object.entries(documentosPorPais).map(([pais, items]) => (
          <optgroup key={pais} label={pais}>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.abreviatura} — {item.nombre} ({item.pais})
              </option>
            ))}
          </optgroup>
        ))}
      </Select>

      <Input
        label="Número de documento"
        name="numeroDocumento"
        value={values.numeroDocumento}
        onChange={(event) => {
          const valor = filtrarNumeroDocumento(event.target.value, documento?.soloNumeros ?? false)
          setField(
            'numeroDocumento',
            documento ? valor.slice(0, documento.longitud) : valor.slice(0, 20),
          )
        }}
        onBlur={() => setTouchedNumero(true)}
        error={touchedNumero ? errors.numeroDocumento ?? errorNumero : errors.numeroDocumento}
        disabled={!documento}
        inputMode={documento?.soloNumeros ? 'numeric' : 'text'}
        maxLength={documento?.longitud ?? 20}
        placeholder={documento ? hintDocumento(documento) : 'Primero elija un tipo de documento'}
        trailing={documento ? `${values.numeroDocumento.length}/${documento.longitud}` : null}
        hint={
          documento ? (
            <p className="text-xs text-stone-400">
              {documento.soloNumeros
                ? 'Este documento solo acepta números.'
                : 'Este documento acepta letras y números.'}
            </p>
          ) : null
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Fecha de nacimiento"
          name="fechaNacimiento"
          type="date"
          value={values.fechaNacimiento}
          onChange={(event) => setField('fechaNacimiento', event.target.value)}
          error={errors.fechaNacimiento}
          max={new Date().toISOString().slice(0, 10)}
        />
        <Select
          label="Sexo"
          name="sexo"
          value={values.sexo}
          onChange={(event) => setField('sexo', event.target.value)}
          error={errors.sexo}
        >
          <option value="">Seleccione</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </Select>
      </div>

      <div className="flex justify-end gap-2 border-t border-stone-200 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={submitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Guardando...' : initial ? 'Guardar cambios' : 'Registrar'}
        </Button>
      </div>
    </form>
  )
}
