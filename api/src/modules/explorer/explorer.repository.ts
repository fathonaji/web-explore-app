import { asc, eq, ilike } from 'drizzle-orm'
import type { db } from '../../database/client'
import { files, folders } from '../../database/schema'
import type { FileRecord, FolderRecord } from './explorer.model'

type Database = typeof db

export interface ExplorerRepository {
  findAllFolders(): Promise<FolderRecord[]>
  findFolderById(folderId: string): Promise<FolderRecord | undefined>
  findDirectSubfolders(folderId: string): Promise<FolderRecord[]>
  findDirectFiles(folderId: string): Promise<FileRecord[]>
  searchFolders(query: string, limit: number): Promise<FolderRecord[]>
  searchFiles(query: string, limit: number): Promise<FileRecord[]>
}

export class DrizzleExplorerRepository implements ExplorerRepository {
  constructor(private readonly database: Database) {}

  findAllFolders() {
    return this.database
      .select({
        id: folders.id,
        parentId: folders.parentId,
        name: folders.name,
        sortOrder: folders.sortOrder,
      })
      .from(folders)
      .orderBy(asc(folders.sortOrder), asc(folders.name))
  }

  async findFolderById(folderId: string) {
    const [folder] = await this.database
      .select({
        id: folders.id,
        parentId: folders.parentId,
        name: folders.name,
        sortOrder: folders.sortOrder,
      })
      .from(folders)
      .where(eq(folders.id, folderId))
      .limit(1)

    return folder
  }

  findDirectSubfolders(folderId: string) {
    return this.database
      .select({
        id: folders.id,
        parentId: folders.parentId,
        name: folders.name,
        sortOrder: folders.sortOrder,
      })
      .from(folders)
      .where(eq(folders.parentId, folderId))
      .orderBy(asc(folders.sortOrder), asc(folders.name))
  }

  findDirectFiles(folderId: string) {
    return this.database
      .select({
        id: files.id,
        folderId: files.folderId,
        name: files.name,
        sizeBytes: files.sizeBytes,
        mimeType: files.mimeType,
        sortOrder: files.sortOrder,
      })
      .from(files)
      .where(eq(files.folderId, folderId))
      .orderBy(asc(files.sortOrder), asc(files.name))
  }

  searchFolders(query: string, limit: number) {
    return this.database
      .select({
        id: folders.id,
        parentId: folders.parentId,
        name: folders.name,
        sortOrder: folders.sortOrder,
      })
      .from(folders)
      .where(ilike(folders.name, `%${query}%`))
      .orderBy(asc(folders.name))
      .limit(limit)
  }

  searchFiles(query: string, limit: number) {
    return this.database
      .select({
        id: files.id,
        folderId: files.folderId,
        name: files.name,
        sizeBytes: files.sizeBytes,
        mimeType: files.mimeType,
        sortOrder: files.sortOrder,
      })
      .from(files)
      .where(ilike(files.name, `%${query}%`))
      .orderBy(asc(files.name))
      .limit(limit)
  }
}
