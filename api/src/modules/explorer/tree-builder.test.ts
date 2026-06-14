import { describe, expect, test } from 'bun:test'
import type { FolderRecord } from './explorer.model'
import { buildFolderTree } from './tree-builder'

const folder = (
  id: string,
  parentId: string | null,
  name: string,
  sortOrder = 0,
): FolderRecord => ({
  id,
  parentId,
  name,
  sortOrder,
})

describe('buildFolderTree', () => {
  test('builds nested folders from flat rows', () => {
    const tree = buildFolderTree([
      folder('api', 'assessment', 'API', 1),
      folder('workspace', null, 'Workspace', 1),
      folder('assessment', 'projects', 'Windows Explorer Assessment', 1),
      folder('projects', 'workspace', 'Projects', 1),
      folder('web', 'assessment', 'Web', 2),
    ])

    expect(tree).toEqual([
      {
        id: 'workspace',
        parentId: null,
        name: 'Workspace',
        children: [
          {
            id: 'projects',
            parentId: 'workspace',
            name: 'Projects',
            children: [
              {
                id: 'assessment',
                parentId: 'projects',
                name: 'Windows Explorer Assessment',
                children: [
                  {
                    id: 'api',
                    parentId: 'assessment',
                    name: 'API',
                    children: [],
                  },
                  {
                    id: 'web',
                    parentId: 'assessment',
                    name: 'Web',
                    children: [],
                  },
                ],
              },
            ],
          },
        ],
      },
    ])
  })

  test('sorts siblings by sort order and name', () => {
    const tree = buildFolderTree([
      folder('z', null, 'Zeta', 2),
      folder('b', null, 'Beta', 1),
      folder('a', null, 'Alpha', 1),
    ])

    expect(tree.map((node) => node.name)).toEqual(['Alpha', 'Beta', 'Zeta'])
  })

  test('keeps folders with missing parents visible as roots', () => {
    const tree = buildFolderTree([folder('lost', 'missing-parent', 'Lost')])

    expect(tree).toEqual([
      {
        id: 'lost',
        parentId: 'missing-parent',
        name: 'Lost',
        children: [],
      },
    ])
  })
})
