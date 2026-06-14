import { closeDatabaseConnection, db } from './client'
import { files, folders, type NewFile, type NewFolder } from './schema'

const folderRows = [
  {
    id: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10401',
    parentId: null,
    name: 'Workspace',
    sortOrder: 1,
  },
  {
    id: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10402',
    parentId: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10401',
    name: 'Projects',
    sortOrder: 1,
  },
  {
    id: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10403',
    parentId: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10402',
    name: 'Windows Explorer Assessment',
    sortOrder: 1,
  },
  {
    id: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10404',
    parentId: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10403',
    name: 'API',
    sortOrder: 1,
  },
  {
    id: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10405',
    parentId: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10403',
    name: 'Web',
    sortOrder: 2,
  },
  {
    id: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10406',
    parentId: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10401',
    name: 'Archive',
    sortOrder: 2,
  },
  {
    id: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10407',
    parentId: null,
    name: 'Documents',
    sortOrder: 2,
  },
  {
    id: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10408',
    parentId: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10407',
    name: 'Invoices',
    sortOrder: 1,
  },
  {
    id: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10409',
    parentId: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10407',
    name: 'Legal',
    sortOrder: 2,
  },
  {
    id: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10410',
    parentId: null,
    name: 'Media',
    sortOrder: 3,
  },
  {
    id: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10411',
    parentId: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10410',
    name: 'Images',
    sortOrder: 1,
  },
  {
    id: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10412',
    parentId: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10410',
    name: 'Videos',
    sortOrder: 2,
  },
] satisfies NewFolder[]

const fileRows = [
  {
    id: '7e1b7b02-5688-448a-86c7-a013b8212001',
    folderId: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10403',
    name: 'assessment-notes.md',
    sizeBytes: 18432,
    mimeType: 'text/markdown',
    sortOrder: 1,
  },
  {
    id: '7e1b7b02-5688-448a-86c7-a013b8212002',
    folderId: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10404',
    name: 'api-contract.json',
    sizeBytes: 4096,
    mimeType: 'application/json',
    sortOrder: 1,
  },
  {
    id: '7e1b7b02-5688-448a-86c7-a013b8212003',
    folderId: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10405',
    name: 'wireframe.png',
    sizeBytes: 245760,
    mimeType: 'image/png',
    sortOrder: 1,
  },
  {
    id: '7e1b7b02-5688-448a-86c7-a013b8212004',
    folderId: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10408',
    name: 'invoice-january.pdf',
    sizeBytes: 98304,
    mimeType: 'application/pdf',
    sortOrder: 1,
  },
  {
    id: '7e1b7b02-5688-448a-86c7-a013b8212005',
    folderId: '0f5a7c0d-7d3a-4ac5-90ec-0fd8d5c10411',
    name: 'screenshot-home.png',
    sizeBytes: 524288,
    mimeType: 'image/png',
    sortOrder: 1,
  },
] satisfies NewFile[]

try {
  await db.transaction(async (tx) => {
    await tx.delete(files)
    await tx.delete(folders)

    await tx.insert(folders).values(folderRows)
    await tx.insert(files).values(fileRows)
  })

  console.info(`Seeded ${folderRows.length} folders and ${fileRows.length} files.`)
} finally {
  await closeDatabaseConnection()
}
