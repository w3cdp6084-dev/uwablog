<template>
  <div class="post-grid">
    <article 
      v-for="(post, index) in posts" 
      :key="post?.id || index"
      class="post-card"
    >
      <div class="post-link">
        <div class="post-thumbnail">
          <img 
            v-if="post?.thumbnail" 
            :src="post.thumbnail" 
            :alt="post.title || ''"
          />
          <div v-else class="no-image">No Image</div>
        </div>
        <div class="post-content">
          <div class="post-meta">
            <time 
              v-if="post?.date"
              :datetime="post.date"
            >
              {{ formatDate(post.date) }}
            </time>
            <div class="post-tags">
              <span 
                v-for="tag in (post?.tags || [])" 
                :key="tag" 
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <h2 class="post-title">{{ post?.title || 'Untitled' }}</h2>
          <p class="post-description">{{ post?.description || '' }}</p>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
interface Post {
  id: string
  title: string
  description: string
  date: string
  slug: string
  tags: string[]
  thumbnail: string | null
}

// APIからデータを取得
const { data: posts } = await useFetch<Post[]>('/api/posts', {
  default: () => []
})

// デバッグ用
watchEffect(() => {
  console.log('Posts data:', posts.value)
})

// 日付フォーマット
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('ja-JP')
  } catch (error) {
    console.error('Date formatting error:', error)
    return ''
  }
}
</script>

<style scoped>
.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.post-card {
  background: var(--bg-color);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.post-card:hover {
  transform: translateY(-4px);
}

.post-link {
  text-decoration: none;
  color: inherit;
}

.post-thumbnail {
  position: relative;
  width: 100%;
  height: 200px;
  background: var(--menu-bg);
}

.post-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-color);
  opacity: 0.5;
}

.post-content {
  padding: 1.5rem;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.8;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  padding: 0.2rem 0.5rem;
  background: var(--menu-bg);
  border-radius: 4px;
  font-size: 0.75rem;
}

.post-title {
  margin: 0 0 1rem;
  font-size: 1.25rem;
  color: var(--text-color);
  line-height: 1.4;
}

.post-description {
  font-size: 0.875rem;
  color: var(--text-color);
  opacity: 0.8;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .post-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

.no-posts {
  text-align: center;
  padding: 2rem;
  color: var(--text-color);
  background: var(--bg-color);
  border-radius: 8px;
  margin: 1rem 0;
}
</style> 