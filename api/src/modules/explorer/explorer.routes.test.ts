import { describe, expect, test } from 'bun:test'
import { FolderNotFoundError } from './explorer.model'
import { createExplorerRoutes } from './explorer.routes'

const folderId = '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10401'

describe('explorer routes', () => {
  test('returns folder tree response', async () => {
    const app = createExplorerRoutes({
      getFolderTree: async () => [
        {
          id: 'root',
          parentId: null,
          name: 'Root',
          children: [],
        },
      ],
      getFolderChildren: async () => {
        throw new Error('not used')
      },
      search: async () => {
        throw new Error('not used')
      },
    })

    const response = await app.handle(new Request('http://localhost/api/v1/folders/tree'))

    await expect(response.json()).resolves.toEqual({
      data: [
        {
          id: 'root',
          parentId: null,
          name: 'Root',
          children: [],
        },
      ],
    })
    expect(response.status).toBe(200)
  })

  test('returns selected folder direct children', async () => {
    const app = createExplorerRoutes({
      getFolderTree: async () => [],
      getFolderChildren: async () => ({
        folder: {
          id: folderId,
          parentId: null,
          name: 'Workspace',
        },
        folders: [],
        files: [],
      }),
      search: async () => {
        throw new Error('not used')
      },
    })

    const response = await app.handle(
      new Request(`http://localhost/api/v1/folders/${folderId}/children`),
    )

    await expect(response.json()).resolves.toEqual({
      data: {
        folder: {
          id: folderId,
          parentId: null,
          name: 'Workspace',
        },
        folders: [],
        files: [],
      },
    })
    expect(response.status).toBe(200)
  })

  test('returns not found error when selected folder is missing', async () => {
    const app = createExplorerRoutes({
      getFolderTree: async () => [],
      getFolderChildren: async () => {
        throw new FolderNotFoundError(folderId)
      },
      search: async () => {
        throw new Error('not used')
      },
    })

    const response = await app.handle(
      new Request(`http://localhost/api/v1/folders/${folderId}/children`),
    )

    await expect(response.json()).resolves.toEqual({
      error: {
        code: 'FOLDER_NOT_FOUND',
        message: `Folder with id "${folderId}" was not found`,
      },
    })
    expect(response.status).toBe(404)
  })

  test('returns search response', async () => {
    const app = createExplorerRoutes({
      getFolderTree: async () => [],
      getFolderChildren: async () => {
        throw new Error('not used')
      },
      search: async () => ({
        folders: [
          {
            id: folderId,
            parentId: null,
            name: 'Workspace',
            path: 'Workspace',
          },
        ],
        files: [],
      }),
    })

    const response = await app.handle(new Request('http://localhost/api/v1/search?q=work'))

    await expect(response.json()).resolves.toEqual({
      data: {
        folders: [
          {
            id: folderId,
            parentId: null,
            name: 'Workspace',
            path: 'Workspace',
          },
        ],
        files: [],
      },
    })
    expect(response.status).toBe(200)
  })
})
