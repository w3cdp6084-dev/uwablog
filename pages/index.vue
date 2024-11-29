<template>
  <div class="container" :class="{ 'is-menu-open': isMenuOpen }">
    <div class="posts-grid">
      <NuxtLink 
        v-for="post in currentPosts" 
        :key="post.slug"
        :to="`/posts/${post.slug}`"
        class="post-card"
      >
        <img 
          v-if="post.thumbnail" 
          :src="post.thumbnail" 
          :alt="post.title"
          class="post-thumbnail"
        >
        <div class="post-content">
          <h2 class="post-title">{{ post.title }}</h2>
          <div class="post-meta">
            <time :datetime="post.date">{{ formatDate(post.date) }}</time>
            <div class="post-tags">
              <span v-for="tag in post.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
          <p v-if="post.description" class="post-description">
            {{ post.description }}
          </p>
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
      
      <div class="page-numbers">
        <button 
          v-for="page in totalPages" 
          :key="page"
          :class="['page-number', { active: page === currentPage }]"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
      </div>

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

<script setup lang="ts">
const { data: posts } = await useFetch('/api/posts')

// ページネーションの設定
const postsPerPage = 6 // 1ページあたりの記事数を6に変更
const currentPage = ref(1)

// 総ページ数の計算
const totalPages = computed(() => {
  if (!posts.value) return 0
  return Math.ceil(posts.value.length / postsPerPage)
})

// 現在のページの記事を取得
const currentPosts = computed(() => {
  if (!posts.value) return []
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return posts.value.slice(start, end)
})

// 日付フォーマット
const formatDate = (dateString: string) => {
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
const { isMenuOpen } = useMenuStore() // Pinia store を使用する場合

// または、provide/inject を使用する場合
// const isMenuOpen = inject('isMenuOpen', ref(false))
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  transition: transform 0.3s ease;
}

.container.is-menu-open {
  transform: translateX(-300px); /* PCサイズのメニュー幅 */
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.post-card {
  display: block;
  text-decoration: none;
  color: inherit;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.post-card:hover {
  transform: translateY(-3px);
}

.post-thumbnail {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.post-content {
  padding: 1.5rem;
}

.post-title {
  font-size: 1.25rem;
  margin: 0 0 1rem;
  line-height: 1.4;
}

.post-meta {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 1rem;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.post-description {
  font-size: 0.875rem;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* ページネーションのスタイル */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem 0;
}

.pagination-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-button:not(:disabled):hover {
  background: #f5f5f5;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-number {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.page-number:hover {
  background: #f5f5f5;
}

.page-number.active {
  background: #000;
  color: white;
  border-color: #000;
}

/* モバイル対応 */
@media (max-width: 768px) {
  .posts-grid {
    grid-template-columns: 1fr;
  }

  .page-numbers {
    display: none;
  }

  .pagination {
    gap: 0.5rem;
  }

  .container.is-menu-open {
    transform: translateX(-80vw); /* モバイルサイズのメニュー幅 */
  }
}
</style>