export type DocumentoIdentidad = {
  id: number
  nombre: string
  abreviatura: string
  pais: string
  longitud: number
  soloNumeros: boolean
  activo: boolean
}

export type Beneficiario = {
  id: number
  nombres: string
  apellidos: string
  documentoIdentidadId: number
  numeroDocumento: string
  fechaNacimiento: string
  sexo: 'M' | 'F'
  documentoNombre: string
  documentoAbreviatura: string
  documentoPais: string
}

export type BeneficiarioPayload = {
  nombres: string
  apellidos: string
  documentoIdentidadId: number
  numeroDocumento: string
  fechaNacimiento: string
  sexo: 'M' | 'F'
}

export type ApiError = {
  message: string
  statusCode?: number
}
