import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '../config/env'
import * as schema from './schema'

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL is required')
}

const queryClient = postgres(env.databaseUrl, {
  max: 10,
})

export const db = drizzle(queryClient, { schema })
export const closeDatabaseConnection = () => queryClient.end()
