<template>
  <div>
    <!-- フローティングボタン -->
    <button 
      class="filter-floating-button"
      @click="isFilterOpen = !isFilterOpen"
      :class="{ active: isFilterOpen }"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
      </svg>
      <span class="filter-badge" v-if="activeFilterCount > 0">
        {{ activeFilterCount }}
      </span>
    </button>

    <!-- フィルターパネル -->
    <div 
      class="filter-panel"
      :class="{ 'is-open': isFilterOpen }"
    >
      <div class="filter-header">
        <h3 class="filter-title">Filter & Sort</h3>
        <button 
          class="close-button"
          @click="isFilterOpen = false"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="filter-content">
        <!-- 既存のフィルター内容 -->
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

const isFilterOpen = ref(false)

// アクティブなフィルターの有無をチェック
const hasActiveFilters = computed(() => {
  return searchQuery.value || selectedTags.value.length > 0
})

// アクティブなフィルターの数を計算
const activeFilterCount = computed(() => {
  let count = 0
  if (searchQuery.value) count++
  count += selectedTags.value.length
  if (sortOrder.value !== 'newest') count++ // デフォルト以外のソート順の場合
  return count
})
</script>

<style scoped>
.filter-floating-button {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 9999px;
  background: white;
  border: 1px solid var(--color-border);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 40;
  transition: all 0.2s;
}

.filter-floating-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.filter-floating-button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.filter-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
}

.filter-floating-button.active .filter-badge {
  background: white;
  color: #3b82f6;
  border-color: #3b82f6;
}

.filter-panel {
  position: fixed;
  bottom: 6rem;
  right: 2rem;
  width: 320px;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 1.5rem;
  transform: translateY(20px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  z-index: 30;
}

.filter-panel.is-open {
  transform: translateY(0);
  opacity: 1;
  visibility: visible;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filter-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.close-button {
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
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
  .filter-panel {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100vh;
    border-radius: 0;
    transform: translateY(100%);
  }

  .filter-panel.is-open {
    transform: translateY(0);
  }
}
</style> 