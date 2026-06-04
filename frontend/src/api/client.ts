import type { ApiError } from '../types'

const API_BASE = import.meta.env.VITE_API_URL ?? ''

export class ApiRequestError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers)

  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const data = isJson
    ? await response.json().catch(() => ({}))
    : null

  if (!response.ok) {
    const err = data as ApiError | null
    throw new ApiRequestError(
      err?.message ?? `Request failed (${response.status})`,
      response.status,
    )
  }

  return data as T
}
