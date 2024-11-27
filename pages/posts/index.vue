<template>
  <div class="posts-page">
    <PostFilter
      :available-tags="availableTags"
      @search="handleSearch"
    />
    <PostList :posts="filteredPosts" />
  </div>
</template>

<script setup lang="ts">
const { data: posts } = await useFetch('/api/posts')

// 利用可能なタグを収集
const availableTags = computed(() => {
  if (!posts.value) return []
  const tags = new Set<string>()
  posts.value.forEach(post => {
    post.tags?.forEach(tag => tags.add(tag))
  })
  return Array.from(tags)
})

// フィルター後の記事（初期値は全記事）
const filteredPosts = ref<any[]>([])

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

  // デバッグ用
  console.log('Filtering with:', filters)

  filteredPosts.value = posts.value.filter(post => {
    // テキスト検索
    const matchesQuery = !filters.query || 
      post.title.toLowerCase().includes(filters.query.toLowerCase()) ||
      post.description?.toLowerCase().includes(filters.query.toLowerCase())

    // タグフィルター
    const matchesTags = filters.tags.length === 0 || 
      filters.tags.every(tag => post.tags?.includes(tag))

    // 日付フィルター
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

    // デバッグ用
    console.log('Post:', post.title, { matchesQuery, matchesTags, matchesDate })

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

@media (max-width: 768px) {
  .posts-page {
    padding: 1rem;
  }
}

h1 {
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: bold;
}
</style> 