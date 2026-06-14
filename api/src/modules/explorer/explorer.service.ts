import {
  type FileListItem,
  type FileRecord,
  type FolderListItem,
  FolderNotFoundError,
  type FolderRecord,
} from './explorer.model'
import type { ExplorerRepository } from './explorer.repository'
import { buildFolderTree } from './tree-builder'

const toFolderListItem = (folder: FolderRecord): FolderListItem => ({
  id: folder.id,
  parentId: folder.parentId,
  name: folder.name,
})

const toFileListItem = (file: FileRecord): FileListItem => ({
  id: file.id,
  folderId: file.folderId,
  name: file.name,
  sizeBytes: file.sizeBytes,
  mimeType: file.mimeType,
})

export class ExplorerService {
  constructor(private readonly repository: ExplorerRepository) {}

  async getFolderTree() {
    const folders = await this.repository.findAllFolders()

    return buildFolderTree(folders)
  }

  async getFolderChildren(folderId: string) {
    const folder = await this.repository.findFolderById(folderId)

    if (!folder) {
      throw new FolderNotFoundError(folderId)
    }

    const [directSubfolders, directFiles] = await Promise.all([
      this.repository.findDirectSubfolders(folderId),
      this.repository.findDirectFiles(folderId),
    ])

    return {
      folder: toFolderListItem(folder),
      folders: directSubfolders.map(toFolderListItem),
      files: directFiles.map(toFileListItem),
    }
  }
}
