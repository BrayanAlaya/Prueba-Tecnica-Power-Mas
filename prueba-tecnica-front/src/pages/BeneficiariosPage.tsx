import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  actualizarBeneficiario,
  crearBeneficiario,
  eliminarBeneficiario,
  listarBeneficiarios,
} from '../api/beneficiarios'
import { listarDocumentos } from '../api/documentos'
import { BeneficiarioForm } from '../components/beneficiarios/BeneficiarioForm'
import { BeneficiarioTable } from '../components/beneficiarios/BeneficiarioTable'
import { DeleteConfirm } from '../components/beneficiarios/DeleteConfirm'
import { Alert } from '../components/ui/Alert'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Pagination } from '../components/ui/Pagination'
import type { Beneficiario, BeneficiarioPayload, DocumentoIdentidad } from '../types'

type Notice = { type: 'success' | 'error'; message: string }

const PAGE_SIZE = 4

export function BeneficiariosPage() {
  const [beneficiarios, setBeneficiarios] = useState<Beneficiario[]>([])
  const [documentos, setDocumentos] = useState<DocumentoIdentidad[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Beneficiario | null>(null)
  const [deleting, setDeleting] = useState<Beneficiario | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [listaBeneficiarios, listaDocumentos] = await Promise.all([
        listarBeneficiarios(),
        listarDocumentos(),
      ])
      setBeneficiarios(listaBeneficiarios)
      setDocumentos(listaDocumentos.filter((documento) => documento.activo))
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'No se pudieron cargar los datos.',
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const filtrados = useMemo(() => {
    const termino = search.trim().toLowerCase()
    if (!termino) {
      return beneficiarios
    }

    return beneficiarios.filter((item) => {
      const haystack = [
        item.nombres,
        item.apellidos,
        item.numeroDocumento,
        item.documentoAbreviatura,
        item.documentoPais,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(termino)
    })
  }, [beneficiarios, search])

  const totalPages = Math.max(1, Math.ceil(filtrados.length / PAGE_SIZE))
  const paginaActual = Math.min(page, totalPages)
  const paginaItems = filtrados.slice((paginaActual - 1) * PAGE_SIZE, paginaActual * PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [search])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  function openCreate() {
    setEditing(null)
    setFormOpen(true)
  }

  function openEdit(beneficiario: Beneficiario) {
    setEditing(beneficiario)
    setFormOpen(true)
  }

  async function handleSave(payload: BeneficiarioPayload) {
    setSubmitting(true)
    try {
      if (editing) {
        const actualizado = await actualizarBeneficiario(editing.id, payload)
        setBeneficiarios((current) =>
          current.map((item) => (item.id === actualizado.id ? actualizado : item)),
        )
        setNotice({ type: 'success', message: 'Beneficiario actualizado correctamente.' })
      } else {
        const creado = await crearBeneficiario(payload)
        setBeneficiarios((current) =>
          [...current, creado].sort((a, b) =>
            `${a.apellidos} ${a.nombres}`.localeCompare(`${b.apellidos} ${b.nombres}`, 'es'),
          ),
        )
        setNotice({ type: 'success', message: 'Beneficiario registrado correctamente.' })
      }
      setFormOpen(false)
      setEditing(null)
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'No se pudo guardar el beneficiario.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!deleting) {
      return
    }

    setSubmitting(true)
    try {
      await eliminarBeneficiario(deleting.id)
      setBeneficiarios((current) => current.filter((item) => item.id !== deleting.id))
      setNotice({ type: 'success', message: 'Beneficiario eliminado correctamente.' })
      setDeleting(null)
    } catch (error) {
      setNotice({
        type: 'error',
        message: error instanceof Error ? error.message : 'No se pudo eliminar el beneficiario.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-6xl space-y-5 px-4 py-8 pb-16 sm:px-6">
      {notice ? (
        <Alert type={notice.type} message={notice.message} onClose={() => setNotice(null)} />
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <label htmlFor="buscar" className="sr-only">
            Buscar
          </label>
          <input
            id="buscar"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por nombre, documento o país"
            className="w-full max-w-sm rounded-md border border-stone-300 bg-white px-3 py-2 text-sm outline-none placeholder:text-stone-400 focus:border-stone-900"
          />
        </div>
        <Button type="button" className="shrink-0 self-start sm:self-auto" onClick={openCreate}>
          Nuevo beneficiario
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
        <BeneficiarioTable
          beneficiarios={paginaItems}
          loading={loading}
          onEdit={openEdit}
          onDelete={setDeleting}
        />
        <div className="flex flex-col gap-3 border-t border-stone-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-stone-500">
            {filtrados.length} de {beneficiarios.length}{' '}
            {beneficiarios.length === 1 ? 'beneficiario' : 'beneficiarios'}
          </p>
          <Pagination page={paginaActual} totalPages={totalPages} onChange={setPage} />
        </div>
      </div>

      <Modal
        open={formOpen}
        title={editing ? 'Editar beneficiario' : 'Nuevo beneficiario'}
        onClose={() => {
          if (!submitting) {
            setFormOpen(false)
            setEditing(null)
          }
        }}
        wide
      >
        <BeneficiarioForm
          key={editing?.id ?? 'nuevo'}
          documentos={documentos}
          initial={editing}
          submitting={submitting}
          onSubmit={handleSave}
          onCancel={() => {
            setFormOpen(false)
            setEditing(null)
          }}
        />
      </Modal>

      <Modal
        open={Boolean(deleting)}
        title="Eliminar beneficiario"
        onClose={() => {
          if (!submitting) {
            setDeleting(null)
          }
        }}
      >
        {deleting ? (
          <DeleteConfirm
            beneficiario={deleting}
            submitting={submitting}
            onConfirm={() => void handleDelete()}
            onCancel={() => setDeleting(null)}
          />
        ) : null}
      </Modal>
    </section>
  )
}
