import type { FolderRecord, FolderTreeNode } from './explorer.model'

const sortByExplorerOrder = <T extends { sortOrder: number; name: string }>(left: T, right: T) => {
  const sortDiff = left.sortOrder - right.sortOrder

  if (sortDiff !== 0) {
    return sortDiff
  }

  return left.name.localeCompare(right.name)
}

export const buildFolderTree = (folders: FolderRecord[]): FolderTreeNode[] => {
  const nodeById = new Map<string, FolderTreeNode>()
  const folderById = new Map<string, FolderRecord>()
  const roots: FolderTreeNode[] = []

  for (const folder of folders) {
    folderById.set(folder.id, folder)
    nodeById.set(folder.id, {
      id: folder.id,
      parentId: folder.parentId,
      name: folder.name,
      children: [],
    })
  }

  for (const folder of folders) {
    const node = nodeById.get(folder.id)

    if (!node) {
      continue
    }

    if (!folder.parentId) {
      roots.push(node)
      continue
    }

    const parent = nodeById.get(folder.parentId)

    if (parent) {
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  }

  const sortNodes = (nodes: FolderTreeNode[]) => {
    nodes.sort((left, right) => {
      const leftFolder = folderById.get(left.id)
      const rightFolder = folderById.get(right.id)

      if (!leftFolder || !rightFolder) {
        return left.name.localeCompare(right.name)
      }

      return sortByExplorerOrder(leftFolder, rightFolder)
    })

    for (const node of nodes) {
      sortNodes(node.children)
    }
  }

  sortNodes(roots)

  return roots
}
