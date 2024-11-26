<template>
  <div class="error-container">
    <div class="error-content">
      <h1 class="error-title">
        {{ error?.statusCode || 500 }}
      </h1>
      <p class="error-message">
        {{ getErrorMessage }}
      </p>
      <NuxtLink 
        to="/" 
        class="home-link"
      >
        ホームに戻る
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const error = useError()

const getErrorMessage = computed(() => {
  switch (error.value?.statusCode) {
    case 404:
      return '記事が見つかりません'
    case 400:
      return '不正なリクエストです'
    default:
      return 'エラーが発生しました'
  }
})
</script>

<style scoped>
.error-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  background-color: #f9fafb;
}

.error-content {
  max-width: 600px;
}

.error-title {
  font-size: 8rem;
  font-weight: bold;
  color: #1f2937;
  line-height: 1;
  margin: 0;
}

.error-message {
  font-size: 1.5rem;
  color: #4b5563;
  margin: 1.5rem 0;
}

.home-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: background-color 0.2s;
}

.home-link:hover {
  background-color: #2563eb;
}
</style> 