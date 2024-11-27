<template>
  <div class="post-grid">
    <!-- 検索結果が0件の場合 -->
    <div v-if="posts.length === 0" class="no-results">
      検索結果が見つかりませんでした
    </div>
    
    <!-- 記事一覧 -->
    <article 
      v-for="post in posts" 
      :key="post.id"
      class="post-card"
    >
      <NuxtLink :to="`/posts/${post.slug}`" class="post-link">
        <div class="post-thumbnail" v-if="post.thumbnail">
          <img :src="post.thumbnail" :alt="post.title">
        </div>
        <div class="post-content">
          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-description">{{ post.description }}</p>
          <div class="post-meta">
            <time :datetime="post.date">{{ formatDate(post.date) }}</time>
            <div class="post-tags">
              <span v-for="tag in post.tags" :key="tag" class="tag">
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </NuxtLink>
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

defineProps<{
  posts: Post[]
}>()

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ja-JP')
}
</script>

<style scoped>
.post-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

@media (max-width: 768px) {
  .post-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .post-card {
    width: 100%;
  }
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
}

.post-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.post-card:hover {
  transform: translateY(-3px);
}

.post-link {
  text-decoration: none;
  color: inherit;
}

.post-thumbnail {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.post-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  padding: 1.5rem;
}

.post-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.post-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
  line-height: 1.5;
}

.post-meta {
  font-size: 0.875rem;
  color: #9ca3af;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}
</style> 