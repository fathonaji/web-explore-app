<script setup lang="ts">
import type { FolderTreeNode } from '../types'
import FolderTreeNodeItem from './FolderTreeNode.vue'

defineProps<{
  folders: FolderTreeNode[]
  isFolderExpanded: (folderId: string) => boolean
  isFolderSelected: (folderId: string) => boolean
}>()

defineEmits<{
  selectFolder: [folderId: string]
  toggleFolder: [folderId: string]
}>()
</script>

<template>
  <p v-if="folders.length === 0" class="pane-message">No folders found.</p>
  <ul v-else class="folder-tree">
    <FolderTreeNodeItem
      v-for="folder in folders"
      :key="folder.id"
      :folder="folder"
      :level="0"
      :is-folder-expanded="isFolderExpanded"
      :is-folder-selected="isFolderSelected"
      @select-folder="$emit('selectFolder', $event)"
      @toggle-folder="$emit('toggleFolder', $event)"
    />
  </ul>
</template>
