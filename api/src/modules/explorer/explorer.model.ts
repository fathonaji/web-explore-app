import type { File, Folder } from '../../database/schema'

export type FolderRecord = Pick<Folder, 'id' | 'parentId' | 'name' | 'sortOrder'>
export type FileRecord = Pick<File, 'id' | 'folderId' | 'name' | 'sizeBytes' | 'mimeType' | 'sortOrder'>

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

export class FolderNotFoundError extends Error {
  constructor(folderId: string) {
    super(`Folder with id "${folderId}" was not found`)
    this.name = 'FolderNotFoundError'
  }
}
