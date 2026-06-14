import { Elysia, t } from 'elysia'
import { FolderNotFoundError } from './explorer.model'
import type { ExplorerService } from './explorer.service'

type ExplorerRouteService = Pick<ExplorerService, 'getFolderTree' | 'getFolderChildren' | 'search'>

export const createExplorerRoutes = (explorerService: ExplorerRouteService) =>
  new Elysia({ prefix: '/api/v1' })
    .get('/folders/tree', async () => ({
      data: await explorerService.getFolderTree(),
    }))
    .get(
      '/folders/:folderId/children',
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
    .get(
      '/search',
      async ({ query }) => ({
        data: await explorerService.search(query.q),
      }),
      {
        query: t.Object({
          q: t.String(),
        }),
      },
    )
