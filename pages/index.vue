<template>
  <div class="container">
    <PostFilter 
      :available-tags="availableTags"
      @search="handleSearch"
      @sort="handleSort"
      @viewChange="handleViewChange"
    />
    
    <!-- 記事一覧 -->
    <div class="animated-border"></div>
    <div 
      class="posts-container"
      :class="viewMode"
    >
      <NuxtLink 
        v-for="post in currentPosts" 
        :key="post.slug"
        :to="`/posts/${post.slug}`"
        class="post-card"
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
        </div>
      </NuxtLink>
    </div>

    <!-- ページネーション -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        :disabled="currentPage === 1"
        @click="currentPage--"
        class="pagination-button"
      >
        前のページ
      </button>
      <span class="pagination-info">
        {{ currentPage }} / {{ totalPages }}
      </span>
      <button 
        :disabled="currentPage === totalPages"
        @click="currentPage++"
        class="pagination-button"
      >
        次のページ
      </button>
    </div>
  </div>
</template>

<script setup>
// データフェッチ
const { data: posts } = await useFetch('/api/posts')

// 既存のコード
const postsPerPage = 6
const currentPage = ref(1)

// 利用可能なタグを取得
const availableTags = computed(() => {
  if (!posts.value) return []
  return [...new Set(posts.value.flatMap(post => post.tags || []))]
})

// 検索フィルターの状態
const searchFilters = ref({
  query: '',
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

    // タグフィルター
    if (searchFilters.value.tags.length > 0) {
      if (!searchFilters.value.tags.every(tag => post.tags?.includes(tag))) {
        return false
      }
    }

    return true
  })
})

// 検索ハンドラー
const handleSearch = (filters) => {
  searchFilters.value = filters
  currentPage.value = 1 // 検索時にページを1に戻す
}

// 並び替えの状態
const sortOrder = ref('newest')

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

// 並び替えハンドラー
const handleSort = (order) => {
  sortOrder.value = order
}

// ページネーション用の記事取得を sortedPosts に変更
const currentPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return sortedPosts.value.slice(start, end)
})

// 総ページ数の計算
const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / postsPerPage)
})

// 日付フォーマット
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ja-JP')
}

// URLのクエリパラメータと同期
const route = useRoute()
const router = useRouter()

// URLからページ番号を取得
watchEffect(() => {
  const page = Number(route.query.page) || 1
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
})

// ページ変更時にURLを更新
watch(currentPage, (newPage) => {
  router.push({
    query: {
      ...route.query,
      page: newPage === 1 ? undefined : newPage.toString()
    }
  })
})

// メニューの状態を取得
const { isMenuOpen } = useMenuStore()

// 表示モードの状態
const viewMode = ref('grid')

// 表示モード変更ハンドラー
const handleViewChange = (mode) => {
  viewMode.value = mode
}
</script>

<style scoped>
.container {
  max-width: 1440px;
  margin: 120px auto 0; 
  padding: 2rem;
  transition: transform 0.3s ease;
}

.container.is-menu-open {
  transform: translateX(-300px); /* PCサイズのメニュー幅 */
}

.posts-container {
  margin: 2rem 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.link-outer {
  width: 386px; /* グリッドの列幅を全て使うように設定 */
  padding: 1.3rem;
  background-color: #ffffff;
  border-radius: 16px;
}

.post-card {
  background-color: #F3F3F3;
  padding: 24px;
  border-radius: 8px;
}

/* グリッド表示 */
.posts-container.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(386px, 1fr));
  gap: 2rem;
}

/* リスト表示 */
.posts-container.list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.posts-container.list .post-card {
  display: flex;
  gap: 1.5rem;
}

.posts-container.list .post-thumbnail {
  width: 200px;
  height: 150px;
}

.posts-container.list .post-content {
  flex: 1;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .posts-container.list .post-card {
    flex-direction: column;
  }

  .posts-container.list .post-thumbnail {
    width: 100%;
    height: 200px;
  }
}

/* ページネーション */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem 0;
}

.pagination-button {
  padding: 0.5rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background: white;
  color: #64748b;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.875rem;
  color: #64748b;
}
.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 30px 0 0 0;
  span{
    background-color: #F9F9F9;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 10px;
  }
}
.animated-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
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
</style>
