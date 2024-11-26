<template>
  <article v-if="post" class="post-detail">
    <!-- ヘッダー部分 -->
    <header class="post-header">
      <div class="post-meta">
        <time :datetime="post.metadata.date">
          {{ formatDate(post.metadata.date) }}
        </time>
        <div class="post-categories">
          <span v-for="tag in post.metadata.tags" :key="tag" class="category-tag">
            {{ tag }}
          </span>
        </div>
      </div>
      <h1 class="post-title">{{ post.metadata.title }}</h1>
    </header>

    <!-- サムネイル画像 -->
    <img 
      v-if="post.metadata.thumbnail" 
      :src="post.metadata.thumbnail" 
      :alt="post.metadata.title"
      class="post-thumbnail"
    />

    <!-- 本文 -->
    <div class="post-content" v-html="compiledMarkdown"></div>

    <!-- SNSシェアボタン -->
    <div class="share-buttons">
      <button 
        class="share-button twitter"
        @click="shareTwitter"
      >
        Share on Twitter
      </button>
      <button 
        class="share-button facebook"
        @click="shareFacebook"
      >
        Share on Facebook
      </button>
      <button 
        class="share-button copy"
        @click="copyUrl"
      >
        {{ isCopied ? 'Copied!' : 'Copy URL' }}
      </button>
    </div>
  </article>
</template>

<script setup lang="ts">
import { marked } from 'marked'

const route = useRoute()
const { data: post } = await useFetch(`/api/posts/${route.params.slug}`)

// マークダウンをHTMLに変換
const compiledMarkdown = computed(() => {
  if (!post.value?.markdown) return ''
  // markdownプロパティが文字列であることを確認
  const markdownText = typeof post.value.markdown === 'string' 
    ? post.value.markdown 
    : post.value.markdown.content || ''
  return marked(markdownText)
})

// 日付フォーマット
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// SNSシェア用の状態
const isCopied = ref(false)

// SNSシェア関数
const shareTwitter = () => {
  const text = post.value?.metadata.title
  const url = window.location.href
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  window.open(shareUrl, '_blank')
}

const shareFacebook = () => {
  const url = window.location.href
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  window.open(shareUrl, '_blank')
}

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    isCopied.value = true
    setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy URL:', err)
  }
}
</script>

<style scoped>
.post-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.post-header {
  margin-bottom: 2rem;
}

.post-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  color: var(--text-color);
  opacity: 0.8;
}

.post-categories {
  display: flex;
  gap: 0.5rem;
}

.category-tag {
  padding: 0.2rem 0.8rem;
  background: var(--menu-bg);
  border-radius: 4px;
  font-size: 0.875rem;
}

.post-title {
  font-size: 2.5rem;
  line-height: 1.4;
  margin: 0;
}

.post-thumbnail {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin: 2rem 0;
}

.post-content {
  line-height: 1.8;
  font-size: 1.1rem;
}

/* マークダウンスタイル */
:deep(h1) { font-size: 2rem; margin: 2rem 0 1rem; }
:deep(h2) { font-size: 1.75rem; margin: 2rem 0 1rem; }
:deep(h3) { font-size: 1.5rem; margin: 1.5rem 0 1rem; }
:deep(p) { margin: 1rem 0; }
:deep(img) { max-width: 100%; height: auto; }
:deep(pre) { 
  background: var(--menu-bg);
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}
:deep(code) { font-family: monospace; }

/* シェアボタン */
.share-buttons {
  display: flex;
  gap: 1rem;
  margin: 3rem 0;
  justify-content: center;
}

.share-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.3s;
}

.share-button:hover {
  opacity: 0.8;
}

.twitter {
  background: #1DA1F2;
  color: white;
}

.facebook {
  background: #4267B2;
  color: white;
}

.copy {
  background: var(--menu-bg);
  color: var(--text-color);
}

/* 関連記事 */
.related-posts {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--menu-bg);
}

.related-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.related-post-card {
  background: var(--bg-color);
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.related-post-card:hover {
  transform: translateY(-4px);
}

.related-thumbnail {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.related-content {
  padding: 1rem;
}

.related-post-title {
  font-size: 1rem;
  margin: 0 0 0.5rem;
}

@media (max-width: 768px) {
  .post-title {
    font-size: 2rem;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }

  .share-buttons {
    flex-direction: column;
  }
}
</style> 