import type {
  ApiEnvelope,
  ApiErrorEnvelope,
  FolderChildren,
  FolderTreeNode,
} from '../types'

const defaultApiBaseUrl = 'http://localhost:3000/api/v1'

const normalizeBaseUrl = (url: string) => url.replace(/\/+$/, '')

const apiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL ?? defaultApiBaseUrl)

export class ExplorerApiError extends Error {
  readonly status: number
  readonly code?: string

  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ExplorerApiError'
    this.status = status
    this.code = code
  }
}

const isApiErrorEnvelope = (value: unknown): value is ApiErrorEnvelope => {
  if (!value || typeof value !== 'object' || !('error' in value)) {
    return false
  }

  const error = (value as ApiErrorEnvelope).error

  return Boolean(error?.code && error.message)
}

const request = async <TData>(
  path: string,
  options: { signal?: AbortSignal } = {},
): Promise<TData> => {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      Accept: 'application/json',
    },
    signal: options.signal,
  })

  const payload: unknown = await response.json()

  if (!response.ok) {
    if (isApiErrorEnvelope(payload)) {
      throw new ExplorerApiError(payload.error.message, response.status, payload.error.code)
    }

    throw new ExplorerApiError('Request failed', response.status)
  }

  return (payload as ApiEnvelope<TData>).data
}

export interface ExplorerApi {
  getFolderTree(options?: { signal?: AbortSignal }): Promise<FolderTreeNode[]>
  getFolderChildren(folderId: string, options?: { signal?: AbortSignal }): Promise<FolderChildren>
}

export const explorerApi: ExplorerApi = {
  getFolderTree: (options) => request('/folders/tree', options),
  getFolderChildren: (folderId, options) =>
    request(`/folders/${encodeURIComponent(folderId)}/children`, options),
}
