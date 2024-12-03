<template>
  <div class="filter-container">
    <div class="filter-controls">
      <!-- 検索バー -->
      <div class="search-bar">
        <div class="search-input-wrapper">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="記事を検索..."
            class="search-input"
            @input="handleSearch"
          >
          <!-- リセットボタン -->
          <button 
            v-if="hasActiveFilters"
            class="reset-button"
            @click="resetFilters"
          >
            検索条件をリセット
          </button>
        </div>
      </div>

      <!-- フィルターグループ -->
      <div class="filter-groups">
        <!-- タグフィルター -->
        <div class="filter-group">
          <h3 class="filter-title">タグ</h3>
          <div class="filter-tags">
            <button
              v-for="tag in availableTags"
              :key="tag"
              :class="['tag-button', { active: selectedTags.includes(tag) }]"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <!-- 日付フィルター -->
        <div class="filter-group">
          <h3 class="filter-title">日付</h3>
          <select 
            v-model="selectedDate" 
            class="date-select"
            @change="handleSearch"
          >
            <option value="">すべての期間</option>
            <option value="week">1週間以内</option>
            <option value="month">1ヶ月以内</option>
            <option value="year">1年以内</option>
          </select>
        </div>
      </div>

      <div class="view-controls">
        <!-- 並び替え -->
        <select 
          v-model="sortOrder" 
          class="sort-select"
          @change="handleSort"
        >
          <option value="newest">最新順</option>
          <option value="oldest">古い順</option>
        </select>

        <!-- 表示切り替え -->
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

<script setup lang="ts">
const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const selectedDate = ref('')
const sortOrder = ref('newest')
const viewMode = ref('grid')

// フィルターが有効かどうかを判定
const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || 
         selectedTags.value.length > 0 || 
         selectedDate.value !== ''
})

const props = defineProps<{
  availableTags: string[]
}>()

const emit = defineEmits<{
  (e: 'search', filters: {
    query: string,
    tags: string[],
    date: string
  }): void
}>()

// フィルターのリセット
const resetFilters = () => {
  searchQuery.value = ''
  selectedTags.value = []
  selectedDate.value = ''
  handleSearch()
}

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index === -1) {
    selectedTags.value.push(tag)
  } else {
    selectedTags.value.splice(index, 1)
  }
  handleSearch()
}

const handleSearch = () => {
  emit('search', {
    query: searchQuery.value,
    tags: selectedTags.value,
    date: selectedDate.value
  })
}

// 並び替えハンドラー
const handleSort = () => {
  emit('sort', sortOrder.value)
}

const changeView = (mode) => {
  viewMode.value = mode
  emit('viewChange', mode)
}
</script>

<style scoped>
.filter-container {
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.search-bar {
  margin-bottom: 1.5rem;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
}

.filter-groups {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.filter-group {
  min-width: 200px;
}

.filter-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 0.75rem;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag-button {
  padding: 0.375rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tag-button.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.date-select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 0.875rem;
}

.search-input-wrapper {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.reset-button {
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reset-button:hover {
  background-color: #dc2626;
}

.sort-control {
  margin-left: auto;
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

.sort-select:hover {
  border-color: #cbd5e1;
}

.sort-select:focus {
  outline: none;
  ring: 2px;
  ring-color: #3b82f6;
}

.filter-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.view-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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

.view-button:hover {
  color: #475569;
}

.view-button.active {
  background: white;
  color: #3b82f6;
}
</style> 