<template>
  <div class="filter-container">
    <div class="filter-inner">
      <!-- Search Input -->
      <div class="filter-search">
        <input
          v-model="searchQuery"
          type="search"
          class="filter-search-input"
          placeholder="検索"
          @input="handleSearch"
        />
      </div>
      
      <!-- Filter Chips -->
      <div class="filter-chips">
        <button
          v-for="tag in availableTags"
          :key="tag"
          class="btn-chip"
          :class="{ 'is-active': selectedTags.includes(tag) }"
          @click="toggleTag(tag)"
        >
          <span class="btn-chip-text">{{ tag }}</span>
        </button>
      </div>
      
      <!-- Reset Button -->
      <div class="filter-reset">
        <button 
          v-if="hasActiveFilters"
          class="btn-reset"
          @click="clearFilters"
        >
          <svg class="btn-reset-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"></path>
          </svg>
          <span>リセット</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  availableTags: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['filter'])

const searchQuery = ref('')
const selectedTags = ref([])

const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || selectedTags.value.length > 0
})

const handleSearch = () => {
  emitFilter()
}

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
  emitFilter()
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedTags.value = []
  emitFilter()
}

const clearTags = () => {
  selectedTags.value = []
  emitFilter()
}

const emitFilter = () => {
  emit('filter', {
    query: searchQuery.value,
    tags: selectedTags.value
  })
}
</script>

<style scoped>
/* Filter Container */
.filter-container {
  margin-bottom: 2.5rem;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1.5rem;
}

.filter-inner {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

/* Search Input */
.filter-search {
  flex: 0 0 auto;
}

.filter-search-input {
  width: 180px;
  height: 32px;
  padding: 0 12px;
  font-size: 0.875rem;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background-color: transparent;
  color: var(--text-color);
  transition: all 0.2s ease;
  outline: none;
}

.filter-search-input:focus {
  border-color: var(--text-color);
}

.filter-search-input::placeholder {
  color: var(--text-secondary);
}

/* Filter Chips */
.filter-chips {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.btn-chip {
  height: 32px;
  padding: 0 16px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background-color: transparent;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn-chip:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.btn-chip.is-active {
  background-color: var(--text-color);
  border-color: var(--text-color);
  color: var(--bg-color);
}

.btn-chip-text {
  display: inline-block;
  line-height: 1;
}

/* Reset Button */
.filter-reset {
  flex: 0 0 auto;
}

.btn-reset {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  height: 32px;
  padding: 0 16px;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid var(--text-color);
  border-radius: 16px;
  background-color: transparent;
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reset:hover {
  background-color: var(--text-color);
  color: var(--bg-color);
}

.btn-reset-icon {
  width: 14px;
  height: 14px;
}

/* Dark mode adjustments */
.dark .btn-chip:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.dark .btn-chip.is-active {
  background-color: var(--text-color);
  color: var(--bg-color);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .filter-container {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
  }
  
  .filter-inner {
    gap: 1rem;
  }
  
  .filter-search {
    flex: 1 1 100%;
  }
  
  .filter-search-input {
    width: 100%;
    height: 30px;
  }
  
  .filter-chips {
    flex: 1 1 auto;
  }
  
  .btn-chip {
    height: 30px;
    padding: 0 14px;
    font-size: 0.813rem;
  }
  
  .btn-reset {
    height: 30px;
    padding: 0 14px;
    font-size: 0.813rem;
  }
}

/* Search input webkit styles */
.filter-search-input::-webkit-search-decoration,
.filter-search-input::-webkit-search-cancel-button,
.filter-search-input::-webkit-search-results-button,
.filter-search-input::-webkit-search-results-decoration {
  -webkit-appearance: none;
}
</style>