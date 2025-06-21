<template>
  <div class="container">
    <div class="tag-header">
      <h1 class="tag-title">
        <span class="tag-icon">#</span>
        {{ $route.params.tag }}
      </h1>
      <p class="tag-description">
        「{{ $route.params.tag }}」タグの記事一覧 ({{ filteredPosts.length }}件)
      </p>
    </div>

    <!-- PostFilterコンポーネントの使用 -->
    <PostFilter 
      :availableTags="availableTags"
      :preselectedTags="[$route.params.tag]"
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
              :class="['tag', { current: tag === $route.params.tag }]"
            >
              {{ tag }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- 記事が見つからない場合 -->
    <div v-if="filteredPosts.length === 0" class="no-posts">
      <p>「{{ $route.params.tag }}」タグの記事が見つかりませんでした。</p>
      <NuxtLink to="/" class="back-link">トップページに戻る</NuxtLink>
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
import PostFilter from '@/components/PostFilter.vue'

const route = useRoute()
const router = useRouter()

// データフェッチ
const { data: posts } = await useFetch('/api/posts')

const postsPerPage = 9
const currentPage = ref(1)

// 現在のタグでフィルタリングされた記事
const filteredPosts = computed(() => {
  if (!posts.value) return []
  const currentTag = route.params.tag
  return posts.value.filter(post => 
    post.tags?.includes(currentTag)
  )
})

// 利用可能なタグを取得
const availableTags = computed(() => {
  if (!posts.value) return []
  return [...new Set(posts.value.flatMap(post => post.tags || []))]
})

// 検索フィルターの状態
const searchFilters = ref({
  query: '',
  tags: [route.params.tag] // 現在のタグを初期値に設定
})

// さらにフィルタリングされた記事（検索条件適用後）
const searchFilteredPosts = computed(() => {
  return filteredPosts.value.filter(post => {
    // キーワード検索
    if (searchFilters.value.query) {
      const query = searchFilters.value.query.toLowerCase()
      const matchesTitle = post.title.toLowerCase().includes(query)
      const matchesDescription = post.description?.toLowerCase().includes(query)
      if (!matchesTitle && !matchesDescription) return false
    }

    // 追加タグフィルター
    if (searchFilters.value.tags.length > 1) {
      // 現在のタグ以外の追加フィルター
      const additionalTags = searchFilters.value.tags.filter(tag => tag !== route.params.tag)
      if (additionalTags.length > 0) {
        if (!additionalTags.every(tag => post.tags?.includes(tag))) {
          return false
        }
      }
    }

    return true
  })
})

const sortOrder = ref('newest')
const viewMode = ref('grid')

// 並び替えを適用した記事一覧
const sortedPosts = computed(() => {
  if (!searchFilteredPosts.value) return []
  
  return [...searchFilteredPosts.value].sort((a, b) => {
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
  return Math.ceil(sortedPosts.value.length / postsPerPage)
})

// 表示するページ番号を計算
const visiblePages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  const half = Math.floor(maxVisiblePages / 2)
  
  let start = Math.max(1, currentPage.value - half)
  let end = Math.min(totalPages.value, start + maxVisiblePages - 1)
  
  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ja-JP')
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handleSort = (order) => {
  sortOrder.value = order
}

const handleViewChange = (mode) => {
  viewMode.value = mode
}

// 検索イベントのハンドラー
const handleSearch = ({ query, tags }) => {
  searchFilters.value.query = query
  searchFilters.value.tags = tags
  currentPage.value = 1
}

// ルートが変更された時の処理
watch(() => route.params.tag, (newTag) => {
  if (newTag) {
    searchFilters.value.tags = [newTag]
    currentPage.value = 1
  }
}, { immediate: true })

// SEO設定
useSeoMeta({
  title: `${route.params.tag} - タグ一覧`,
  description: `「${route.params.tag}」タグの記事一覧ページです。`
})
</script>

<style scoped>
.container {
  max-width: 1440px;
  margin: 120px auto 0; 
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

.tag-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
  border-bottom: 1px solid var(--color-border);
}

.tag-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.tag-icon {
  color: #FB6C24;
  font-weight: 900;
}

.tag-description {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
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

.post-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.post-thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
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
  transition: all 0.2s ease;
}

.tag:hover {
  background-color: #FB6C24;
  border-color: #FB6C24;
  color: white;
}

.tag.current {
  background-color: #FB6C24;
  border-color: #FB6C24;
  color: white;
  font-weight: 600;
}

.no-posts {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.back-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #FB6C24;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.back-link:hover {
  background-color: #e55a1f;
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
  
  .tag-title {
    font-size: 2rem;
  }
}
</style>