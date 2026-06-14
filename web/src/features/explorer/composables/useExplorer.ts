import { computed, onMounted, ref } from 'vue'
import { explorerApi, type ExplorerApi } from '../api/explorerApi'
import type { FolderChildren, FolderTreeNode, LoadStatus } from '../types'

const collectFolderIds = (nodes: FolderTreeNode[]) => {
  const folderIds = new Set<string>()
  const stack = [...nodes]

  while (stack.length > 0) {
    const node = stack.pop()

    if (!node) {
      continue
    }

    folderIds.add(node.id)
    stack.push(...node.children)
  }

  return folderIds
}

export const useExplorer = (api: ExplorerApi = explorerApi) => {
  const folderTree = ref<FolderTreeNode[]>([])
  const selectedFolderId = ref<string | null>(null)
  const selectedFolderChildren = ref<FolderChildren | null>(null)
  const expandedFolderIds = ref<Set<string>>(new Set())
  const treeStatus = ref<LoadStatus>('idle')
  const childrenStatus = ref<LoadStatus>('idle')
  const errorMessage = ref<string | null>(null)
  let childrenRequestId = 0

  const isTreeLoading = computed(() => treeStatus.value === 'loading')
  const isChildrenLoading = computed(() => childrenStatus.value === 'loading')
  const hasSelectedFolder = computed(() => selectedFolderId.value !== null)

  const loadFolderTree = async () => {
    treeStatus.value = 'loading'
    errorMessage.value = null

    try {
      const tree = await api.getFolderTree()

      folderTree.value = tree
      expandedFolderIds.value = collectFolderIds(tree)
      treeStatus.value = 'success'
    } catch (error) {
      treeStatus.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : 'Failed to load folders'
    }
  }

  const selectFolder = async (folderId: string) => {
    const requestId = childrenRequestId + 1
    childrenRequestId = requestId
    selectedFolderId.value = folderId
    childrenStatus.value = 'loading'
    errorMessage.value = null

    try {
      const children = await api.getFolderChildren(folderId)

      if (requestId !== childrenRequestId) {
        return
      }

      selectedFolderChildren.value = children
      childrenStatus.value = 'success'
    } catch (error) {
      if (requestId !== childrenRequestId) {
        return
      }

      selectedFolderChildren.value = null
      childrenStatus.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : 'Failed to load folder contents'
    }
  }

  const toggleFolder = (folderId: string) => {
    const nextExpandedFolderIds = new Set(expandedFolderIds.value)

    if (nextExpandedFolderIds.has(folderId)) {
      nextExpandedFolderIds.delete(folderId)
    } else {
      nextExpandedFolderIds.add(folderId)
    }

    expandedFolderIds.value = nextExpandedFolderIds
  }

  const isFolderExpanded = (folderId: string) => expandedFolderIds.value.has(folderId)
  const isFolderSelected = (folderId: string) => selectedFolderId.value === folderId

  onMounted(loadFolderTree)

  return {
    folderTree,
    selectedFolderId,
    selectedFolderChildren,
    expandedFolderIds,
    treeStatus,
    childrenStatus,
    errorMessage,
    isTreeLoading,
    isChildrenLoading,
    hasSelectedFolder,
    loadFolderTree,
    selectFolder,
    toggleFolder,
    isFolderExpanded,
    isFolderSelected,
  }
}
