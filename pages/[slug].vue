<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

const { data: post, pending, error } = await useFetch(`/api/posts/${slug}`)

if (error.value) {
  throw createError({
    statusCode: error.value?.statusCode || 404,
    message: error.value?.message || 'Post not found'
  })
}
</script>

<template>
  <div class="post-container">
    <!-- スケルトンローディング -->
    <div v-if="pending" class="skeleton">
      <div class="skeleton-title"></div>
      <div class="skeleton-meta">
        <div class="skeleton-date"></div>
        <div class="skeleton-tags">
          <div class="skeleton-tag" v-for="n in 3" :key="n"></div>
        </div>
      </div>
      <div class="skeleton-description"></div>
      <div class="skeleton-content">
        <div class="skeleton-line" v-for="n in 5" :key="n"></div>
      </div>
    </div>

    <!-- 記事コンテンツ -->
    <div v-else-if="post" class="post-content">
      <h1>{{ post.metadata.title }}</h1>
      <div class="post-meta">
        <span class="date">{{ post.metadata.date }}</span>
        <div class="tags">
          <span v-for="tag in post.metadata.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
        </div>
      </div>
      <div class="description">
        {{ post.metadata.description }}
      </div>
      <div class="content">
        <!-- コンテンツ表示 -->
      </div>
    </div>

    <!-- エラー表示 -->
    <div v-else-if="error" class="error">
      {{ error.message }}
    </div>
  </div>
</template>

<style scoped>
.post-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
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

/* スケルトンベーススタイル */
.skeleton-base {
  background: linear-gradient(90deg, 
    #f0f0f0 25%, 
    #e0e0e0 50%, 
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

/* スケルトンコンポーネント */
.skeleton-title {
  @extend .skeleton-base;
  height: 40px;
  margin-bottom: 20px;
}

.skeleton-meta {
  margin: 15px 0;
}

.skeleton-date {
  @extend .skeleton-base;
  width: 100px;
  height: 20px;
}

.skeleton-tags {
  display: flex;
  gap: 8px;
  margin-top: 10px;
}

.skeleton-tag {
  @extend .skeleton-base;
  width: 60px;
  height: 24px;
}

.skeleton-description {
  @extend .skeleton-base;
  height: 60px;
  margin: 20px 0;
}

.skeleton-content {
  margin-top: 30px;
}

.skeleton-line {
  @extend .skeleton-base;
  height: 16px;
  margin-bottom: 10px;
  &:nth-child(2) { width: 95%; }
  &:nth-child(3) { width: 90%; }
  &:nth-child(4) { width: 97%; }
  &:nth-child(5) { width: 85%; }
}

.post-meta {
  margin: 10px 0;
  color: #666;
}

.tags {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.tag {
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.description {
  margin: 20px 0;
  font-style: italic;
  color: #666;
}

.content {
  margin-top: 30px;
}
</style>