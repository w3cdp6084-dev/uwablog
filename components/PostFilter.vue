<template>
  <div class="filter-container">
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
  </div>
</template>

<script setup lang="ts">
const searchQuery = ref('')
const selectedTags = ref<string[]>([])
const selectedDate = ref('')

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
</style> 