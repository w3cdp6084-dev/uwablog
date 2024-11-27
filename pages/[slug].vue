<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string

// シンプルなfetchの実装
const { data: post, pending, error } = await useFetch(`/api/posts/${slug}`)

// エラーハンドリング
if (error.value) {
  throw createError({
    statusCode: error.value?.statusCode || 404,
    message: error.value?.message || 'Post not found'
  })
}
</script>

<template>
  <div class="post-container">
    <!-- ローディング表示 -->
    <div v-if="pending" class="loading">
      Loading...
    </div>

    <!-- エラー表示 -->
    <div v-else-if="error" class="error">
      {{ error.message }}
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

    <!-- フォールバック表示 -->
    <div v-else class="not-found">
      Post not found
    </div>
  </div>
</template>

<style scoped>
.post-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error, .not-found {
  text-align: center;
  padding: 20px;
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