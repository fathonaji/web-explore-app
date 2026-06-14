import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import {
  bigint,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

export const folders = pgTable(
  'folders',
  {
    id: uuid('id').primaryKey(),
    parentId: uuid('parent_id').references((): AnyPgColumn => folders.id, {
      onDelete: 'cascade',
    }),
    name: text('name').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('folders_parent_id_idx').on(table.parentId),
    index('folders_parent_name_idx').on(table.parentId, table.name),
    uniqueIndex('folders_parent_name_unique').on(table.parentId, table.name),
  ],
)

export const files = pgTable(
  'files',
  {
    id: uuid('id').primaryKey(),
    folderId: uuid('folder_id')
      .notNull()
      .references(() => folders.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    sizeBytes: bigint('size_bytes', { mode: 'number' }),
    mimeType: text('mime_type'),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('files_folder_id_idx').on(table.folderId),
    index('files_folder_name_idx').on(table.folderId, table.name),
    uniqueIndex('files_folder_name_unique').on(table.folderId, table.name),
  ],
)

export type Folder = typeof folders.$inferSelect
export type NewFolder = typeof folders.$inferInsert
export type File = typeof files.$inferSelect
export type NewFile = typeof files.$inferInsert
