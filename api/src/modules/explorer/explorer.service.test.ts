import { describe, expect, test } from 'bun:test'
import { FolderNotFoundError } from './explorer.model'
import type { ExplorerRepository } from './explorer.repository'
import { ExplorerService } from './explorer.service'

const createRepository = (
  overrides: Partial<ExplorerRepository> = {},
): ExplorerRepository => ({
  findAllFolders: async () => [],
  findFolderById: async () => undefined,
  findDirectSubfolders: async () => [],
  findDirectFiles: async () => [],
  searchFolders: async () => [],
  searchFiles: async () => [],
  ...overrides,
})

describe('ExplorerService', () => {
  test('returns complete folder tree', async () => {
    const service = new ExplorerService(
      createRepository({
        findAllFolders: async () => [
          { id: 'root', parentId: null, name: 'Root', sortOrder: 1 },
          { id: 'child', parentId: 'root', name: 'Child', sortOrder: 1 },
        ],
      }),
    )

    await expect(service.getFolderTree()).resolves.toEqual([
      {
        id: 'root',
        parentId: null,
        name: 'Root',
        children: [
          {
            id: 'child',
            parentId: 'root',
            name: 'Child',
            children: [],
          },
        ],
      },
    ])
  })

  test('returns direct subfolders and files for selected folder', async () => {
    const service = new ExplorerService(
      createRepository({
        findFolderById: async () => ({
          id: 'root',
          parentId: null,
          name: 'Root',
          sortOrder: 1,
        }),
        findDirectSubfolders: async () => [
          {
            id: 'child',
            parentId: 'root',
            name: 'Child',
            sortOrder: 1,
          },
        ],
        findDirectFiles: async () => [
          {
            id: 'file',
            folderId: 'root',
            name: 'notes.txt',
            sizeBytes: 128,
            mimeType: 'text/plain',
            sortOrder: 1,
          },
        ],
      }),
    )

    await expect(service.getFolderChildren('root')).resolves.toEqual({
      folder: {
        id: 'root',
        parentId: null,
        name: 'Root',
      },
      folders: [
        {
          id: 'child',
          parentId: 'root',
          name: 'Child',
        },
      ],
      files: [
        {
          id: 'file',
          folderId: 'root',
          name: 'notes.txt',
          sizeBytes: 128,
          mimeType: 'text/plain',
        },
      ],
    })
  })

  test('throws when selected folder does not exist', async () => {
    const service = new ExplorerService(createRepository())

    await expect(service.getFolderChildren('missing')).rejects.toBeInstanceOf(FolderNotFoundError)
  })

  test('returns folder and file search results with paths', async () => {
    const service = new ExplorerService(
      createRepository({
        findAllFolders: async () => [
          { id: 'root', parentId: null, name: 'Workspace', sortOrder: 1 },
          { id: 'projects', parentId: 'root', name: 'Projects', sortOrder: 1 },
          {
            id: 'assessment',
            parentId: 'projects',
            name: 'Windows Explorer Assessment',
            sortOrder: 1,
          },
        ],
        searchFolders: async () => [
          {
            id: 'assessment',
            parentId: 'projects',
            name: 'Windows Explorer Assessment',
            sortOrder: 1,
          },
        ],
        searchFiles: async () => [
          {
            id: 'file',
            folderId: 'assessment',
            name: 'assessment-notes.md',
            sizeBytes: 1024,
            mimeType: 'text/markdown',
            sortOrder: 1,
          },
        ],
      }),
    )

    await expect(service.search('assessment')).resolves.toEqual({
      folders: [
        {
          id: 'assessment',
          parentId: 'projects',
          name: 'Windows Explorer Assessment',
          path: 'Workspace/Projects/Windows Explorer Assessment',
        },
      ],
      files: [
        {
          id: 'file',
          folderId: 'assessment',
          name: 'assessment-notes.md',
          sizeBytes: 1024,
          mimeType: 'text/markdown',
          path: 'Workspace/Projects/Windows Explorer Assessment/assessment-notes.md',
        },
      ],
    })
  })

  test('returns empty search results for short query', async () => {
    const service = new ExplorerService(createRepository())

    await expect(service.search('a')).resolves.toEqual({
      folders: [],
      files: [],
    })
  })
})
