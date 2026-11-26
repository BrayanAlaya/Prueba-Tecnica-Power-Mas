import type { ApiError } from '../types'

const API_URL = import.meta.env.VITE_API_URL ?? '/api'

async function parseError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiError & {
      errors?: Record<string, string[]>
      title?: string
    }

    if (data.message) {
      return data.message
    }

    if (data.errors) {
      return Object.values(data.errors).flat().join(' ')
    }

    return data.title ?? 'Ocurrió un error inesperado.'
  } catch {
    return `Error ${response.status} al comunicarse con el servidor.`
  }
}

export async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const { headers, ...rest } = options ?? {}
  const response = await fetch(`${API_URL}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  })

  if (response.status === 204) {
    return undefined as T
  }

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  return (await response.json()) as T
}
