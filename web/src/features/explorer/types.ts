export interface FolderTreeNode {
  id: string
  parentId: string | null
  name: string
  children: FolderTreeNode[]
}

export interface FolderListItem {
  id: string
  parentId: string | null
  name: string
}

export interface FileListItem {
  id: string
  folderId: string
  name: string
  sizeBytes: number | null
  mimeType: string | null
}

export interface FolderChildren {
  folder: FolderListItem
  folders: FolderListItem[]
  files: FileListItem[]
}

export interface ApiEnvelope<TData> {
  data: TData
}

export interface ApiErrorEnvelope {
  error: {
    code: string
    message: string
  }
}

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'
