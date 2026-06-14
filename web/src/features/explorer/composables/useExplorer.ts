import { computed, onMounted, ref, watch } from 'vue'
import { explorerApi, type ExplorerApi } from '../api/explorerApi'
import type { ExplorerSearchResult, FolderChildren, FolderTreeNode, LoadStatus } from '../types'

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
  const searchQuery = ref('')
  const searchResult = ref<ExplorerSearchResult | null>(null)
  const treeStatus = ref<LoadStatus>('idle')
  const childrenStatus = ref<LoadStatus>('idle')
  const searchStatus = ref<LoadStatus>('idle')
  const errorMessage = ref<string | null>(null)
  let childrenRequestId = 0
  let searchRequestId = 0
  let searchDebounceId: ReturnType<typeof setTimeout> | undefined

  const isTreeLoading = computed(() => treeStatus.value === 'loading')
  const isChildrenLoading = computed(() => childrenStatus.value === 'loading')
  const isSearching = computed(() => searchStatus.value === 'loading')
  const hasSelectedFolder = computed(() => selectedFolderId.value !== null)
  const normalizedSearchQuery = computed(() => searchQuery.value.trim())
  const isSearchActive = computed(() => normalizedSearchQuery.value.length >= 2)

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

  const search = async (query = normalizedSearchQuery.value) => {
    const requestId = searchRequestId + 1
    searchRequestId = requestId

    if (query.length < 2) {
      searchResult.value = null
      searchStatus.value = 'idle'
      return
    }

    searchStatus.value = 'loading'
    errorMessage.value = null

    try {
      const result = await api.search(query)

      if (requestId !== searchRequestId) {
        return
      }

      searchResult.value = result
      searchStatus.value = 'success'
    } catch (error) {
      if (requestId !== searchRequestId) {
        return
      }

      searchResult.value = null
      searchStatus.value = 'error'
      errorMessage.value = error instanceof Error ? error.message : 'Failed to search'
    }
  }

  const clearSearch = () => {
    searchQuery.value = ''
    searchResult.value = null
    searchStatus.value = 'idle'
  }

  const openFolderFromSearch = async (folderId: string) => {
    clearSearch()
    await selectFolder(folderId)
  }

  const openFileFromSearch = async (folderId: string) => {
    clearSearch()
    await selectFolder(folderId)
  }

  watch(searchQuery, () => {
    window.clearTimeout(searchDebounceId)

    if (!isSearchActive.value) {
      searchResult.value = null
      searchStatus.value = 'idle'
      return
    }

    searchDebounceId = window.setTimeout(() => {
      void search()
    }, 250)
  })

  onMounted(loadFolderTree)

  return {
    folderTree,
    selectedFolderId,
    selectedFolderChildren,
    expandedFolderIds,
    searchQuery,
    searchResult,
    treeStatus,
    childrenStatus,
    searchStatus,
    errorMessage,
    isTreeLoading,
    isChildrenLoading,
    isSearching,
    hasSelectedFolder,
    isSearchActive,
    loadFolderTree,
    selectFolder,
    toggleFolder,
    isFolderExpanded,
    isFolderSelected,
    search,
    clearSearch,
    openFolderFromSearch,
    openFileFromSearch,
  }
}
