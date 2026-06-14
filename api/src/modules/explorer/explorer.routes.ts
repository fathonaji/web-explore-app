import { Elysia, t } from 'elysia'
import { FolderNotFoundError } from './explorer.model'
import type { ExplorerService } from './explorer.service'

export const createExplorerRoutes = (explorerService: ExplorerService) =>
  new Elysia({ prefix: '/api/v1/folders' })
    .get('/tree', async () => ({
      data: await explorerService.getFolderTree(),
    }))
    .get(
      '/:folderId/children',
      async ({ params, set }) => {
        try {
          return {
            data: await explorerService.getFolderChildren(params.folderId),
          }
        } catch (error) {
          if (error instanceof FolderNotFoundError) {
            set.status = 404

            return {
              error: {
                code: 'FOLDER_NOT_FOUND',
                message: error.message,
              },
            }
          }

          throw error
        }
      },
      {
        params: t.Object({
          folderId: t.String({ format: 'uuid' }),
        }),
      },
    )
