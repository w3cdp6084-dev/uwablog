<template>
  <div class="filter-bar">
    <div class="filter-container">
      <!-- 検索フィールド -->
      <div class="search-field" :class="{ 'is-focused': isSearchFocused }">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input 
          type="text" 
          placeholder="記事を検索..." 
          class="search-input"
          v-model="searchQuery"
          @input="handleSearch"
          @focus="isSearchFocused = true"
          @blur="isSearchFocused = false"
        >
        <button 
          v-if="searchQuery" 
          class="clear-button"
          @click="clearSearch"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- タグフィルター -->
      <div class="filter-chips">
        <button
          v-for="tag in availableTags"
          :key="tag"
          class="filter-chip"
          :class="{ active: selectedTags.includes(tag) }"
          @click="toggleTag(tag)"
        >
          {{ tag }}
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            stroke-width="2"
            class="chip-arrow"
            :class="{ rotated: selectedTags.includes(tag) }"
          >
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </button>
      </div>

      <!-- ソート・表示切り替え -->
      <div class="filter-controls">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
  },
  preselectedTags: {
    type: Array,
    default: () => []
  }
})

const searchQuery = ref('')
const selectedTags = ref([...props.preselectedTags])
const sortOrder = ref('newest')
const viewMode = ref('grid')

const emit = defineEmits(['search', 'sort', 'viewChange'])

// 検索ハンドラー
const handleSearch = () => {
  emit('search', {
    query: searchQuery.value,
    tags: selectedTags.value
  })
}

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

// preselectedTagsが変更された時にselectedTagsを更新
watch(() => props.preselectedTags, (newTags) => {
  selectedTags.value = [...newTags]
  handleSearch()
}, { immediate: true })

// 並び替えハンドラー
const handleSort = () => {
  emit('sort', sortOrder.value)
}

// 表示モード切り替えハンドラー
const changeView = (mode) => {
  viewMode.value = mode
  emit('viewChange', mode)
}

const isSearchFocused = ref(false)

// 検索クリア
const clearSearch = () => {
  searchQuery.value = ''
  handleSearch()
}
</script>

<style scoped>
.filter-bar {
  position: sticky;
  top: 100px;
  z-index: 30;
  background: var(--bg-color);
  border-bottom: 1px solid var(--color-border);
  padding: 16px 0;
  margin-bottom: 24px;
}

.filter-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

/* 検索フィールド */
.search-field {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--card-inner-bg);
  border: 1px solid var(--color-border);
  border-radius: 24px;
  padding: 8px 16px;
  min-width: 200px;
  transition: all 0.2s ease;
}

.search-field.is-focused {
  border-color: #FB6C24;
  box-shadow: 0 0 0 2px rgba(251, 108, 36, 0.1);
}

.search-field svg {
  color: var(--color-text-secondary);
  margin-right: 8px;
  flex-shrink: 0;
}

.search-input {
  border: none;
  background: none;
  outline: none;
  flex: 1;
  font-size: 14px;
  color: var(--color-text);
  padding: 4px 0;
}

.search-input::placeholder {
  color: var(--color-text-secondary);
}

.clear-button {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--color-text-secondary);
  border-radius: 50%;
  margin-left: 8px;
  transition: all 0.2s ease;
}

.clear-button:hover {
  background: rgba(0, 0, 0, 0.1);
  color: var(--color-text);
}

/* フィルターチップ */
.filter-chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.filter-chips::-webkit-scrollbar {
  display: none;
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: var(--card-inner-bg);
  border: 1px solid var(--color-border);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.filter-chip:hover {
  background: var(--tag-bg);
  border-color: #FB6C24;
}

.filter-chip.active {
  background: #FB6C24;
  border-color: #FB6C24;
  color: white;
}

.chip-arrow {
  transition: transform 0.2s ease;
}

.chip-arrow.rotated {
  transform: rotate(180deg);
}

/* コントロールエリア */
.filter-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--card-inner-bg);
  color: var(--color-text);
  font-size: 14px;
  cursor: pointer;
  outline: none;
  transition: all 0.2s ease;
}

.sort-select:focus {
  border-color: #FB6C24;
}

.view-toggle {
  display: flex;
  background: var(--card-bg);
  border-radius: 8px;
  padding: 2px;
  border: 1px solid var(--color-border);
}

.view-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-button:hover {
  background: var(--card-inner-bg);
}

.view-button.active {
  background: var(--card-inner-bg);
  color: #FB6C24;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .filter-container {
    flex-direction: column;
    align-items: stretch;
    gap: 16px;
  }
  
  .search-field {
    min-width: auto;
    width: 100%;
  }
  
  .filter-chips {
    justify-content: flex-start;
    padding-bottom: 8px;
  }
  
  .filter-controls {
    justify-content: space-between;
  }
  
  .sort-select {
    flex: 1;
    margin-right: 16px;
  }
}

@media (max-width: 480px) {
  .filter-container {
    padding: 0 0.5rem;
  }
  
  .filter-chip {
    font-size: 12px;
    padding: 6px 10px;
  }
}
</style> 