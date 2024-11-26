<template>
  <div class="container">
    <h1 class="page-title">Latest Posts</h1>
    <PostList />
  </div>
</template>

<script setup lang="ts">
import PostList from '~/components/PostList.vue'
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-title {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--text-color);
}
</style>