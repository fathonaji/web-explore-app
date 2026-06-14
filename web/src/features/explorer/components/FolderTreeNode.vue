<script setup lang="ts">
import { computed } from 'vue'
import type { FolderTreeNode } from '../types'

const props = defineProps<{
  folder: FolderTreeNode
  level: number
  isFolderExpanded: (folderId: string) => boolean
  isFolderSelected: (folderId: string) => boolean
}>()

defineEmits<{
  selectFolder: [folderId: string]
  toggleFolder: [folderId: string]
}>()

const hasChildren = computed(() => props.folder.children.length > 0)
const isExpanded = computed(() => props.isFolderExpanded(props.folder.id))
const isSelected = computed(() => props.isFolderSelected(props.folder.id))
const nodePadding = computed(() => `${props.level * 18 + 8}px`)
</script>

<template>
  <li>
    <div
      class="folder-node"
      :class="{ selected: isSelected }"
      :style="{ paddingLeft: nodePadding }"
    >
      <button
        class="tree-toggle"
        type="button"
        :disabled="!hasChildren"
        :aria-label="`${isExpanded ? 'Collapse' : 'Expand'} ${folder.name}`"
        @click.stop="$emit('toggleFolder', folder.id)"
      >
        <span v-if="hasChildren">{{ isExpanded ? '▾' : '▸' }}</span>
      </button>

      <button class="folder-button" type="button" @click="$emit('selectFolder', folder.id)">
        <span class="folder-icon" aria-hidden="true"></span>
        <span class="item-name">{{ folder.name }}</span>
      </button>
    </div>

    <ul v-if="hasChildren && isExpanded" class="folder-tree nested">
      <FolderTreeNode
        v-for="child in folder.children"
        :key="child.id"
        :folder="child"
        :level="level + 1"
        :is-folder-expanded="isFolderExpanded"
        :is-folder-selected="isFolderSelected"
        @select-folder="$emit('selectFolder', $event)"
        @toggle-folder="$emit('toggleFolder', $event)"
      />
    </ul>
  </li>
</template>
