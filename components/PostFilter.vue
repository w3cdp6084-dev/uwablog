<template>
  <div class="filter-container">
    <div class="filter-controls">
      <!-- 検索とタグ -->
      <div class="search-tag-group">
        <input 
          type="text" 
          placeholder="Search..." 
          class="search-input"
          v-model="searchQuery"
          @input="handleSearch"
        >
        <div class="tag-buttons">
          <button
            v-for="tag in availableTags"
            :key="tag"
            class="tag-button"
            :class="{ active: selectedTags.includes(tag) }"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- 表示コントロール -->
      <div class="view-controls">
        <select 
          v-model="sortOrder" 
          class="sort-select"
          @change="handleSort"
        >
          <option value="newest">最新順</option>
          <option value="oldest">古い順</option>
        </select>

        <div class="view-toggle">
          <button 
            class="view-button"
            :class="{ active: viewMode === 'grid' }"
            @click="changeView('grid')"
            title="グリッド表示"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
          </button>
          <button 
            class="view-button"
            :class="{ active: viewMode === 'list' }"
            @click="changeView('list')"
            title="リスト表示"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  availableTags: {
    type: Array,
    default: () => []
  }
})

const searchQuery = ref('')
const selectedTags = ref([])
const sortOrder = ref('newest')
const viewMode = ref('grid')

const emit = defineEmits(['search', 'sort', 'viewChange'])

// タグの切り替え
const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
  handleSearch()
}

// 検索ハンドラー
const handleSearch = () => {
  emit('search', {
    query: searchQuery.value,
    tags: selectedTags.value
  })
}

// 並び替えハンドラー
const handleSort = () => {
  emit('sort', sortOrder.value)
}

// 表示モード切り替えハンドラー
const changeView = (mode) => {
  viewMode.value = mode
  emit('viewChange', mode)
}
</script>

<style scoped>
.filter-container {
  margin-bottom: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.search-tag-group {
  display: flex;
  gap: 1rem;
  flex: 1;
}

.search-input {
  min-width: 200px;
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.tag-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag-button {
  padding: 0.25rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  background: white;
  color: #64748b;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.tag-button.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.view-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.sort-select {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: white;
  color: #64748b;
  font-size: 0.875rem;
  cursor: pointer;
}

.view-toggle {
  display: flex;
  gap: 0.25rem;
  padding: 0.25rem;
  background: #f1f5f9;
  border-radius: 0.5rem;
}

.view-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border: none;
  border-radius: 0.375rem;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.view-button.active {
  background: white;
  color: #3b82f6;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-tag-group {
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }

  .view-controls {
    justify-content: space-between;
    margin-top: 1rem;
  }

  .sort-select {
    flex: 1;
    margin-right: 1rem;
  }

  .tag-buttons {
    width: 100%;
    margin-top: 0.75rem;
  }
}

@media (max-width: 480px) {
  .filter-container {
    padding: 0.75rem;
  }

  .view-controls {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .sort-select {
    width: 100%;
    margin-right: 0;
    margin-bottom: 0.5rem;
  }

  .view-toggle {
    width: 100%;
    justify-content: center;
  }

  .tag-buttons {
    justify-content: center;
  }
}
</style> 