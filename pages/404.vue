<template>
  <div class="error-container">
    <div class="error-content">
      <h1 class="error-title">404</h1>
      <p class="error-message">ページが見つかりませんでした</p>
      <p class="error-description">
        お探しのページは削除されたか、URLが間違っている可能性があります。
      </p>
      <NuxtLink to="/" class="home-link">
        ホームに戻る
      </NuxtLink>
    </div>
  </div>
</template>

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
  margin: 1rem 0;
}

.error-description {
  color: #6b7280;
  margin-bottom: 2rem;
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