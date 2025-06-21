<template>
  <div class="container" :class="{ 'is-menu-open': isMenuOpen }">
    
    <!-- PostFilterコンポーネントの使用 -->
    <PostFilter 
      :availableTags="availableTags"
      @search="handleSearch"
      @sort="handleSort"
      @viewChange="handleViewChange"
    />

    <div class="posts-container" :class="viewMode">
      <div 
        v-for="post in currentPosts" 
        :key="post.slug"
        class="post-card group"
      >
        <div class="link-outer">
          <NuxtLink :to="`/posts/${post.slug}`" class="post-link">
            <img 
              v-if="post.thumbnail" 
              :src="post.thumbnail" 
              :alt="post.title"
              class="post-thumbnail"
            >
            <div class="post-content">
              <time :datetime="post.date">{{ formatDate(post.date) }}</time>
              <div class="post-meta">
                <h2 class="post-title text-base">{{ post.title }}</h2>
                <p v-if="post.description" class="text-sm post-description">
                  {{ post.description }}
                </p>
              </div>
            </div>
          </NuxtLink>
          <div class="post-tags">
            <NuxtLink 
              v-for="tag in post.tags" 
              :key="tag" 
              :to="`/tags/${tag}`"
              class="tag"
            >
              {{ tag }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- ページネーション -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        @click="handlePageChange(currentPage - 1)"
        :disabled="currentPage === 1"
        class="pagination-btn prev"
      >
        ← 前へ
      </button>
      
      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="handlePageChange(page)"
          :class="['page-btn', { active: page === currentPage }]"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        @click="handlePageChange(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="pagination-btn next"
      >
        次へ →
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMenuStore } from '@/stores/menu'
import PostFilter from '@/components/PostFilter.vue'

// データフェッチ
const { data: posts } = await useFetch('/api/posts')

const route = useRoute()
const router = useRouter()
const { isMenuOpen } = useMenuStore()

const postsPerPage = 9
const currentPage = ref(1)

// 利用可能なフィルターオプションを取得
const availableTags = computed(() => {
  if (!posts.value) return []
  return [...new Set(posts.value.flatMap(post => post.tags || []))]
})

const availableTypes = computed(() => {
  if (!posts.value) return []
  return [...new Set(posts.value.map(post => post.type || ''))]
})

const availableCategories = computed(() => {
  if (!posts.value) return []
  return [...new Set(posts.value.map(post => post.category || ''))]
})

const availableColors = computed(() => {
  if (!posts.value) return []
  return [...new Set(posts.value.map(post => post.color || ''))]
})

const availableFonts = computed(() => {
  if (!posts.value) return []
  return [...new Set(posts.value.map(post => post.font || ''))]
})

// 検索フィルターの状態
const searchFilters = ref({
  query: '',
  type: '',
  category: '',
  color: '',
  font: '',
  tags: []
})

// フィルタリングされた記事
const filteredPosts = computed(() => {
  if (!posts.value) return []
  
  return posts.value.filter(post => {
    // キーワード検索
    if (searchFilters.value.query) {
      const query = searchFilters.value.query.toLowerCase()
      const matchesTitle = post.title.toLowerCase().includes(query)
      const matchesDescription = post.description?.toLowerCase().includes(query)
      if (!matchesTitle && !matchesDescription) return false
    }

    // タイプフィルター
    if (searchFilters.value.type && post.type !== searchFilters.value.type) {
      return false
    }

    // カテゴリーフィルター
    if (searchFilters.value.category && post.category !== searchFilters.value.category) {
      return false
    }

    // カラーフィルター
    if (searchFilters.value.color && post.color !== searchFilters.value.color) {
      return false
    }

    // フォントフィルター
    if (searchFilters.value.font && post.font !== searchFilters.value.font) {
      return false
    }

    // タグフィルター
    if (searchFilters.value.tags.length > 0) {
      if (!searchFilters.value.tags.every(tag => post.tags?.includes(tag))) {
        return false
      }
    }

    return true
  })
})

// 並び替えを適用した記事一覧
const sortedPosts = computed(() => {
  if (!filteredPosts.value) return []
  
  return [...filteredPosts.value].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    
    return sortOrder.value === 'newest' 
      ? dateB - dateA  // 最新順
      : dateA - dateB  // 古い順
  })
})

// ページネーション用の記事取得
const currentPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return sortedPosts.value.slice(start, end)
})

// 総ページ数の計算
const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / postsPerPage)
})

// 表示するページ番号を計算
const visiblePages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  const half = Math.floor(maxVisiblePages / 2)
  
  let start = Math.max(1, currentPage.value - half)
  let end = Math.min(totalPages.value, start + maxVisiblePages - 1)
  
  // 終端が調整された場合、開始点も調整
  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const sortOrder = ref('newest')
const viewMode = ref('grid')

const handleSort = (order) => {
  sortOrder.value = order
}

const handleViewChange = (mode) => {
  viewMode.value = mode
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ja-JP')
}

const handlePageChange = (page) => {
  currentPage.value = page
}

watch(() => route.query.page, (newPage) => {
  const page = Number(newPage) || 1
  if (page >= 1 && page <= totalPages.value) {
    handlePageChange(page)
  }
}, { immediate: true })

watch(currentPage, (newPage) => {
  router.push({
    query: {
      ...route.query,
      page: newPage === 1 ? undefined : newPage.toString()
    }
  })
})

// 検索イベントのハンドラー
const handleSearch = ({ query, tags }) => {
  searchFilters.value.query = query
  searchFilters.value.tags = tags
  // フィルター変更時はページを1に戻す
  currentPage.value = 1
}

</script>

<style scoped>
.container {
  max-width: 1440px;
  margin: 120px auto 0; 
  padding: 1rem;
  transition: transform 0.3s ease;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

.posts-container {
  margin: 1rem 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .posts-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .posts-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

.link-outer {
  width: 100%;
  padding: 1rem;
  background-color: var(--card-inner-bg);
  border-radius: 16px;
}

@media (min-width: 768px) {
  .link-outer {
    padding: 1.3rem;
  }
}

.post-thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.post-card {
  background-color: var(--card-bg);
  padding: 1rem;
  border-radius: 8px;
}

@media (min-width: 768px) {
  .post-card {
    padding: 24px;
  }
}

.post-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.tag {
  background-color: var(--tag-bg);
  border: 1px solid var(--tag-border);
  color: var(--tag-text);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-block;
}

.tag:hover {
  background-color: #FB6C24;
  border-color: #FB6C24;
  color: white;
}

.posts-container.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.posts-container.list .post-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 768px) {
  .posts-container.list .post-card {
    flex-direction: row;
    gap: 1.5rem;
  }

  .posts-container.list .post-thumbnail {
    width: 200px;
    height: 150px;
  }

  .posts-container.list .post-content {
    flex: 1;
  }
}


@media (max-width: 768px) {
  .posts-container.list .post-card {
    flex-direction: column;
  }

  .posts-container.list .post-thumbnail {
    width: 100%;
    height: 200px;
  }
}

.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-input, .filter-select, .tag-select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  transition: border-color 0.3s ease;
}

.search-input {
  flex: 1;
}

.filter-select {
  min-width: 150px;
}

.tag-select {
  min-width: 200px;
}

.search-input:focus, .filter-select:focus, .tag-select:focus {
  border-color: #FB6C24;
}

/* ページネーションのスタイル */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 3rem 0 2rem;
  padding: 1rem;
}

.pagination-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  background-color: #fff;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 100px;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #FB6C24;
  color: white;
  border-color: #FB6C24;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background-color: #f5f5f5;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background-color: #fff;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  transition: all 0.3s ease;
}

.page-btn:hover {
  background-color: #f8f9fa;
  border-color: #FB6C24;
}

.page-btn.active {
  background-color: #FB6C24;
  color: white;
  border-color: #FB6C24;
}

/* モバイル対応 */
@media (max-width: 640px) {
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pagination-btn {
    min-width: 120px;
  }
  
  .page-numbers {
    order: -1;
  }
}
</style>