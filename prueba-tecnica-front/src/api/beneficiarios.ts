import type { Beneficiario, BeneficiarioPayload } from '../types'
import { request } from './http'

export function listarBeneficiarios() {
  return request<Beneficiario[]>('/beneficiarios')
}

export function crearBeneficiario(payload: BeneficiarioPayload) {
  return request<Beneficiario>('/beneficiarios', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function actualizarBeneficiario(id: number, payload: BeneficiarioPayload) {
  return request<Beneficiario>(`/beneficiarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

export function eliminarBeneficiario(id: number) {
  return request<void>(`/beneficiarios/${id}`, {
    method: 'DELETE',
  })
}
