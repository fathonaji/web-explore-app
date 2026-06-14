<script setup lang="ts">
import type { FileListItem, FolderChildren, FolderListItem } from '../types'

defineProps<{
  children: FolderChildren | null
  isLoading: boolean
  hasSelectedFolder: boolean
  errorMessage: string | null
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
        <h2>{{ children?.folder.name ?? '' }}</h2>
        <span v-if="children">
          {{ children.folders.length }} folders, {{ children.files.length }} files
        </span>
      </div>
    </div>

    <div v-if="isLoading" class="empty-state">Loading contents...</div>
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
