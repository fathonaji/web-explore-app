import {
  type ExplorerSearchResult,
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

const createFolderPath = (folder: FolderRecord, folderById: Map<string, FolderRecord>) => {
  const pathSegments = [folder.name]
  let parentId = folder.parentId

  while (parentId) {
    const parent = folderById.get(parentId)

    if (!parent) {
      break
    }

    pathSegments.unshift(parent.name)
    parentId = parent.parentId
  }

  return pathSegments.join('/')
}

export class ExplorerService {
  private readonly searchLimit = 25

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

  async search(query: string): Promise<ExplorerSearchResult> {
    const normalizedQuery = query.trim()

    if (normalizedQuery.length < 2) {
      return {
        folders: [],
        files: [],
      }
    }

    const [allFolders, matchingFolders, matchingFiles] = await Promise.all([
      this.repository.findAllFolders(),
      this.repository.searchFolders(normalizedQuery, this.searchLimit),
      this.repository.searchFiles(normalizedQuery, this.searchLimit),
    ])
    const folderById = new Map(allFolders.map((folder) => [folder.id, folder]))

    return {
      folders: matchingFolders.map((folder) => ({
        ...toFolderListItem(folder),
        path: createFolderPath(folder, folderById),
      })),
      files: matchingFiles.map((file) => {
        const parentFolder = folderById.get(file.folderId)
        const parentPath = parentFolder ? createFolderPath(parentFolder, folderById) : ''

        return {
          ...toFileListItem(file),
          path: parentPath ? `${parentPath}/${file.name}` : file.name,
        }
      }),
    }
  }
}
