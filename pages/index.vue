<template>
  <div class="posts-page">
    <PostFilter
      :available-tags="availableTags"
      @search="handleSearch"
    />
    
    <!-- スケルトンローディング -->
    <div v-if="pending" class="post-grid">
      <div v-for="n in 6" :key="n" class="post-skeleton">
        <div class="skeleton-thumbnail"></div>
        <div class="skeleton-content">
          <div class="skeleton-title"></div>
          <div class="skeleton-meta">
            <div class="skeleton-date"></div>
            <div class="skeleton-tags">
              <div class="skeleton-tag" v-for="t in 3" :key="t"></div>
            </div>
          </div>
          <div class="skeleton-description"></div>
        </div>
      </div>
    </div>

    <!-- 記事一覧 -->
    <PostList 
      v-else-if="posts" 
      :posts="filteredPosts" 
    />

    <!-- エラー表示 -->
    <div v-else-if="error" class="error">
      {{ error.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
// データ取得
const { data: posts, pending, error } = await useFetch('/api/posts')

// デバッグ用
console.log('Fetched posts:', {
  count: posts.value?.length,
  data: posts.value
})

// 利用可能なタグを収集
const availableTags = computed(() => {
  if (!posts.value) return []
  const tags = new Set<string>()
  posts.value.forEach(post => {
    post.tags?.forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
})

// フィルター後の記事
const filteredPosts = ref(posts.value || [])

// 初期表示時に全記事を設定
watchEffect(() => {
  if (posts.value) {
    filteredPosts.value = posts.value
  }
})

// 検索処理
const handleSearch = (filters: {
  query: string,
  tags: string[],
  date: string
}) => {
  if (!posts.value) return

  filteredPosts.value = posts.value.filter(post => {
    const matchesQuery = !filters.query || 
      post.title.toLowerCase().includes(filters.query.toLowerCase()) ||
      post.description?.toLowerCase().includes(filters.query.toLowerCase())

    const matchesTags = filters.tags.length === 0 || 
      filters.tags.every(tag => post.tags?.includes(tag))

    let matchesDate = true
    if (filters.date) {
      const postDate = new Date(post.date)
      const now = new Date()
      switch (filters.date) {
        case 'week':
          matchesDate = now.getTime() - postDate.getTime() <= 7 * 24 * 60 * 60 * 1000
          break
        case 'month':
          matchesDate = now.getTime() - postDate.getTime() <= 30 * 24 * 60 * 60 * 1000
          break
        case 'year':
          matchesDate = now.getTime() - postDate.getTime() <= 365 * 24 * 60 * 60 * 1000
          break
      }
    }

    return matchesQuery && matchesTags && matchesDate
  })
}
</script>

<style scoped>
.posts-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  width: 100%;
}

/* スケルトンアニメーション */
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* スケルトングリッド */
.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

/* スケルトンカード */
.post-skeleton {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.skeleton-base {
  background: linear-gradient(90deg, 
    #f0f0f0 25%, 
    #e0e0e0 50%, 
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-thumbnail {
  @extend .skeleton-base;
  width: 100%;
  height: 200px;
}

.skeleton-content {
  padding: 1rem;
}

.skeleton-title {
  @extend .skeleton-base;
  height: 24px;
  margin-bottom: 1rem;
  border-radius: 4px;
}

.skeleton-meta {
  margin: 0.5rem 0;
}

.skeleton-date {
  @extend .skeleton-base;
  width: 80px;
  height: 16px;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.skeleton-tags {
  display: flex;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.skeleton-tag {
  @extend .skeleton-base;
  width: 60px;
  height: 24px;
  border-radius: 4px;
}

.skeleton-description {
  @extend .skeleton-base;
  height: 60px;
  border-radius: 4px;
  margin-top: 1rem;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .post-grid {
    grid-template-columns: 1fr;
  }
  
  .posts-page {
    padding: 1rem;
  }
}

.error {
  text-align: center;
  padding: 2rem;
  color: #dc3545;
}
</style>