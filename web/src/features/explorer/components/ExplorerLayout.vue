<script setup lang="ts">
import { useExplorer } from '../composables/useExplorer'
import FolderContentPane from './FolderContentPane.vue'
import FolderTree from './FolderTree.vue'

const explorer = useExplorer()
</script>

<template>
  <main class="explorer-shell">
    <header class="explorer-toolbar">
      <div>
        <h1>Windows Explorer</h1>
      </div>
      <button
        class="toolbar-button"
        type="button"
        :disabled="explorer.isTreeLoading.value"
        @click="explorer.loadFolderTree"
      >
        Refresh
      </button>
    </header>

    <section class="explorer-panels" aria-label="Windows Explorer">
      <aside class="folder-sidebar" aria-label="Folder structure">
        <div class="pane-header">
          <h2>Folders</h2>
          <span>{{ explorer.folderTree.value.length }} roots</span>
        </div>

        <p v-if="explorer.isTreeLoading.value" class="pane-message">Loading folders...</p>
        <p v-else-if="explorer.treeStatus.value === 'error'" class="pane-message error">
          {{ explorer.errorMessage.value }}
        </p>
        <FolderTree
          v-else
          :folders="explorer.folderTree.value"
          :is-folder-expanded="explorer.isFolderExpanded"
          :is-folder-selected="explorer.isFolderSelected"
          @select-folder="explorer.selectFolder"
          @toggle-folder="explorer.toggleFolder"
        />
      </aside>

      <FolderContentPane
        :children="explorer.selectedFolderChildren.value"
        :is-loading="explorer.isChildrenLoading.value"
        :has-selected-folder="explorer.hasSelectedFolder.value"
        :error-message="explorer.childrenStatus.value === 'error' ? explorer.errorMessage.value : null"
      />
    </section>
  </main>
</template>
