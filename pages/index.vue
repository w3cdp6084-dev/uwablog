<template>
  <div class="posts-page">
    <PostFilter
      :available-tags="availableTags"
      @search="handleSearch"
    />
    <PostList 
      v-if="posts" 
      :posts="filteredPosts" 
    />
    <div v-else class="loading">
      Loading...
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

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

@media (max-width: 768px) {
  .posts-page {
    padding: 1rem;
  }
}
</style>