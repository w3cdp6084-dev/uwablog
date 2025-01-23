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
      <NuxtLink 
        v-for="post in currentPosts" 
        :key="post.slug"
        :to="`/posts/${post.slug}`"
        class="post-card group"
      >
        <div class="link-outer">
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
              <div class="post-tags">
                <span v-for="tag in post.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
          <div class="animated-border"></div>
        </div>
      </NuxtLink>
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

const postsPerPage = 6
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
  background-color: #ffffff;
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
  background-color: #F3F3F3;
  padding: 1rem;
  border-radius: 8px;
}

@media (min-width: 768px) {
  .post-card {
    padding: 24px;
  }
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

.animated-border::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 2px solid transparent;
  border-radius: 0.5rem;
}

.group:hover .animated-border::before {
  animation: border-dance 1.5s linear infinite;
}

@keyframes border-dance {
  0% {
    border-color: #FB6C24 transparent transparent transparent;
  }
  25% {
    border-color: #FB6C24 #FB6C24 transparent transparent;
  }
  50% {
    border-color: #FB6C24 #FB6C24 #FB6C24 transparent;
  }
  75% {
    border-color: #FB6C24 #FB6C24 #FB6C24 #FB6C24;
  }
  100% {
    border-color: transparent transparent transparent #FB6C24;
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
</style>