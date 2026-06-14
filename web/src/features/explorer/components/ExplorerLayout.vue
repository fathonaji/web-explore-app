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
      <div class="toolbar-actions">
        <label class="search-field">
          <span class="visually-hidden">Search folders and files</span>
          <input
            v-model="explorer.searchQuery.value"
            type="search"
            placeholder="Search folders and files"
          />
        </label>
        <button
          v-if="explorer.searchQuery.value"
          class="toolbar-button"
          type="button"
          @click="explorer.clearSearch"
        >
          Clear
        </button>
        <button
          class="toolbar-button"
          type="button"
          :disabled="explorer.isTreeLoading.value"
          @click="explorer.loadFolderTree"
        >
          Refresh
        </button>
      </div>
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
        :search-query="explorer.searchQuery.value"
        :search-result="explorer.searchResult.value"
        :is-search-active="explorer.isSearchActive.value"
        :is-searching="explorer.isSearching.value"
        :search-error-message="explorer.searchStatus.value === 'error' ? explorer.errorMessage.value : null"
        @open-folder="explorer.openFolderFromSearch"
        @open-file="explorer.openFileFromSearch"
      />
    </section>
  </main>
</template>
