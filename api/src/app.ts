import { cors } from '@elysiajs/cors'
import { Elysia } from 'elysia'
import { db } from './database/client'
import { DrizzleExplorerRepository } from './modules/explorer/explorer.repository'
import { createExplorerRoutes } from './modules/explorer/explorer.routes'
import { ExplorerService } from './modules/explorer/explorer.service'

const explorerService = new ExplorerService(new DrizzleExplorerRepository(db))

export const app = new Elysia()
  .use(cors())
  .get('/api/v1/health', () => ({
    status: 'ok',
  }))
  .use(createExplorerRoutes(explorerService))
