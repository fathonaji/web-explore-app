<script setup lang="ts">
import type {
  ExplorerSearchResult,
  FileListItem,
  FolderChildren,
  FolderListItem,
} from '../types'

defineProps<{
  children: FolderChildren | null
  isLoading: boolean
  hasSelectedFolder: boolean
  errorMessage: string | null
  searchQuery: string
  searchResult: ExplorerSearchResult | null
  isSearchActive: boolean
  isSearching: boolean
  searchErrorMessage: string | null
}>()

defineEmits<{
  openFolder: [folderId: string]
  openFile: [folderId: string]
}>()

const formatFileSize = (sizeBytes: number | null) => {
  if (sizeBytes === null) {
    return '-'
  }

  if (sizeBytes < 1024) {
    return `${sizeBytes} B`
  }

  if (sizeBytes < 1024 * 1024) {
    return `${(sizeBytes / 1024).toFixed(1)} KB`
  }

  return `${(sizeBytes / 1024 / 1024).toFixed(1)} MB`
}

const folderItem = (folder: FolderListItem) => ({
  id: folder.id,
  icon: 'folder-icon',
  name: folder.name,
  type: 'Folder',
  size: '-',
})

const fileItem = (file: FileListItem) => ({
  id: file.id,
  icon: 'file-icon',
  name: file.name,
  type: file.mimeType ?? 'File',
  size: formatFileSize(file.sizeBytes),
})
</script>

<template>
  <section class="content-pane" aria-label="Folder contents">
    <div class="pane-header">
      <div>
        <h2>{{ isSearchActive ? 'Search results' : (children?.folder.name ?? '') }}</h2>
        <span v-if="isSearchActive && searchResult">
          {{ searchResult.folders.length }} folders, {{ searchResult.files.length }} files
        </span>
        <span v-else-if="isSearchActive">Search folders and files</span>
        <span v-else-if="children">
          {{ children.folders.length }} folders, {{ children.files.length }} files
        </span>
      </div>
    </div>

    <div v-if="isSearchActive && isSearching" class="empty-state">Searching...</div>
    <div v-else-if="isSearchActive && searchErrorMessage" class="empty-state error">
      {{ searchErrorMessage }}
    </div>
    <div
      v-else-if="
        isSearchActive &&
        searchResult &&
        searchResult.folders.length === 0 &&
        searchResult.files.length === 0
      "
      class="empty-state"
    >
      No results for "{{ searchQuery.trim() }}".
    </div>

    <table v-else-if="isSearchActive && searchResult" class="content-table search-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Location</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="folder in searchResult.folders" :key="folder.id">
          <td>
            <button class="content-link" type="button" @click="$emit('openFolder', folder.id)">
              <span class="folder-icon" aria-hidden="true"></span>
              {{ folder.name }}
            </button>
          </td>
          <td>{{ folder.path }}</td>
          <td>Folder</td>
        </tr>
        <tr v-for="file in searchResult.files" :key="file.id">
          <td>
            <button class="content-link" type="button" @click="$emit('openFile', file.folderId)">
              <span class="file-icon" aria-hidden="true"></span>
              {{ file.name }}
            </button>
          </td>
          <td>{{ file.path }}</td>
          <td>{{ file.mimeType ?? 'File' }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else-if="isLoading" class="empty-state">Loading contents...</div>
    <div v-else-if="errorMessage" class="empty-state error">{{ errorMessage }}</div>
    <div v-else-if="!hasSelectedFolder" class="empty-state blank" aria-hidden="true"></div>
    <div
      v-else-if="children && children.folders.length === 0 && children.files.length === 0"
      class="empty-state"
    >
      This folder is empty.
    </div>

    <table v-else-if="children" class="content-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>Size</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in children.folders.map(folderItem)" :key="item.id">
          <td>
            <span class="content-name">
              <span :class="item.icon" aria-hidden="true"></span>
              {{ item.name }}
            </span>
          </td>
          <td>{{ item.type }}</td>
          <td>{{ item.size }}</td>
        </tr>
        <tr v-for="item in children.files.map(fileItem)" :key="item.id">
          <td>
            <span class="content-name">
              <span :class="item.icon" aria-hidden="true"></span>
              {{ item.name }}
            </span>
          </td>
          <td>{{ item.type }}</td>
          <td>{{ item.size }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
