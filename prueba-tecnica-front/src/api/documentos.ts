import type { DocumentoIdentidad } from '../types'
import { request } from './http'

export function listarDocumentos() {
  return request<DocumentoIdentidad[]>('/documentos-identidad')
}
