import type { DocumentoIdentidad } from '../types'

export function hintDocumento(documento: DocumentoIdentidad) {
  const formato = documento.soloNumeros ? 'solo dígitos' : 'letras y números'
  return `${documento.abreviatura} de ${documento.pais}: ${documento.longitud} caracteres, ${formato}.`
}

export function validarNumeroDocumento(
  valor: string,
  documento: DocumentoIdentidad | undefined,
): string | null {
  if (!documento) {
    return 'Seleccione un tipo de documento.'
  }

  if (!valor.trim()) {
    return 'El número de documento es obligatorio.'
  }

  if (valor.length !== documento.longitud) {
    return `Debe tener exactamente ${documento.longitud} caracteres.`
  }

  if (documento.soloNumeros && !/^\d+$/.test(valor)) {
    return 'Solo se permiten dígitos.'
  }

  return null
}

export function filtrarNumeroDocumento(valor: string, soloNumeros: boolean) {
  const limpio = valor.replace(/\s/g, '')
  return soloNumeros ? limpio.replace(/\D/g, '') : limpio.toUpperCase()
}

export function calcularEdad(fechaIso: string) {
  const nacimiento = new Date(`${fechaIso}T00:00:00`)
  const hoy = new Date()
  let edad = hoy.getFullYear() - nacimiento.getFullYear()
  const mes = hoy.getMonth() - nacimiento.getMonth()

  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad -= 1
  }

  return edad
}

export function formatearFecha(fechaIso: string) {
  const [anio, mes, dia] = fechaIso.slice(0, 10).split('-')
  return `${dia}/${mes}/${anio}`
}
