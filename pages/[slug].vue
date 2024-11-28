<template>
  <div class="post-container">
    <div v-if="post" class="post-content">
      <header>
        <h1>{{ post.metadata?.title }}</h1>
        <div class="post-meta">
          <time :datetime="post.metadata?.date">
            {{ formatDate(post.metadata?.date) }}
          </time>
          <div class="tags">
            <span v-for="tag in post.metadata?.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </header>

      <div class="description">
        {{ post.metadata?.description }}
      </div>
      
      <div class="content">
        <!-- コンテンツ表示 -->
      </div>

      <!-- コンテンツの最下部にシェアボタンを配置 -->
      <div class="share-section">
        <p class="share-text">この記事をシェアする</p>
        <div class="share-buttons">
          <a 
            :href="shareUrls.twitter" 
            target="_blank" 
            rel="noopener noreferrer"
            class="share-button twitter"
          >
            <span>X（Twitter）でシェア</span>
          </a>
          
          <a 
            :href="shareUrls.facebook" 
            target="_blank" 
            rel="noopener noreferrer"
            class="share-button facebook"
          >
            <span>Facebookでシェア</span>
          </a>
          
          <button 
            @click="copyUrl" 
            class="share-button copy"
          >
            <span>URLをコピー</span>
          </button>
        </div>
      </div>
    </div>

    <div v-else-if="pending" class="loading">
      Loading...
    </div>

    <div v-else-if="error" class="error">
      {{ error.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const slug = route.params.slug as string
const { data: post, pending, error } = await useFetch(`/api/posts/${slug}`)

// デバッグログを追加
console.log('Post data:', post.value)

// 現在のURLを取得
const currentUrl = computed(() => {
  if (process.client) {
    const url = window.location.href
    console.log('Current URL:', url)
    return url
  }
  return ''
})

// シェアURLの生成
const shareUrls = computed(() => {
  console.log('Generating share URLs for post:', post.value)
  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.value?.metadata?.title || '')}&url=${encodeURIComponent(currentUrl.value)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl.value)}`
  }
})

// URLコピー機能
const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(currentUrl.value)
    alert('URLをコピーしました！')
  } catch (err) {
    console.error('URLのコピーに失敗しました:', err)
  }
}

if (error.value) {
  throw createError({
    statusCode: error.value?.statusCode || 404,
    message: error.value?.message || 'Post not found'
  })
}
</script>

<style scoped>
.post-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

/* シェアボタンのスタイル */
.share-buttons {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.share-button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: none;
  color: white;
  transition: opacity 0.2s;
}

.share-button:hover {
  opacity: 0.8;
}

.twitter {
  background-color: #000;
}

.facebook {
  background-color: #1877f2;
}

.copy {
  background-color: #666;
}

/* モバイル対応 */
@media (max-width: 768px) {
  .share-buttons {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .share-button {
    width: 100%;
    justify-content: center;
  }
}

/* 既存のスタイル */
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

.loading, .error {
  text-align: center;
  padding: 20px;
}

/* サムネイル画像のスタイル */
.thumbnail {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

/* シェアセクションのスタイル */
.share-section {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #eaeaea;
}

.share-text {
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 500;
  color: #666;
}

.share-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.share-button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: none;
  color: white;
  transition: opacity 0.2s;
}

.share-button:hover {
  opacity: 0.8;
}

.twitter {
  background-color: #000;
}

.facebook {
  background-color: #1877f2;
}

.copy {
  background-color: #666;
}

/* モバイル対応 */
@media (max-width: 768px) {
  .share-buttons {
    flex-wrap: wrap;
  }
  
  .share-button {
    width: 100%;
    justify-content: center;
  }
}
</style>