<template>
  <div class="posts-page">
    <h1>記事一覧</h1>
    <PostList />
  </div>
</template>

<script setup lang="ts">
// PostListコンポーネントは自動的にインポートされます
</script>

<style scoped>
.posts-page {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
  font-size: 2rem;
  font-weight: bold;
}
</style> 