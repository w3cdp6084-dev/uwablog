<template>
  <div v-if="pending" class="loading-container">
    Loading...
  </div>
  <div v-else-if="error" class="error-container">
    <NuxtErrorBoundary>
      <error :error="error" />
    </NuxtErrorBoundary>
  </div>
  <div v-else class="post-container">
    <article v-if="post" class="post-content">
      <header>
        <h1>{{ post.metadata.title }}</h1>
        <div class="post-meta">
          <time v-if="post.metadata.date" :datetime="post.metadata.date">
            {{ formatDate(post.metadata.date) }}
          </time>
          <div class="tags">
            <span v-for="tag in post.metadata.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
        </div>
      </header>

      <div v-if="post.metadata.thumbnail" class="thumbnail">
        <img :src="post.metadata.thumbnail" :alt="post.metadata.title">
      </div>

      <div class="content">
        <div v-for="block in post.content" :key="block.id" class="block">
          <p v-if="block.type === 'paragraph'" class="paragraph">
            {{ block.paragraph.rich_text?.[0]?.plain_text || '' }}
          </p>

          <h2 
            v-if="block.type === 'heading_1'" 
            :id="`heading-${block.id}`"
            class="heading-1"
          >
            {{ block.heading_1.rich_text?.[0]?.plain_text || '' }}
          </h2>

          <h3 
            v-else-if="block.type === 'heading_2'" 
            :id="`heading-${block.id}`"
            class="heading-2"
          >
            {{ block.heading_2.rich_text?.[0]?.plain_text || '' }}
          </h3>

          <h4 
            v-else-if="block.type === 'heading_3'" 
            :id="`heading-${block.id}`"
            class="heading-3"
          >
            {{ block.heading_3.rich_text?.[0]?.plain_text || '' }}
          </h4>

          <ul v-else-if="block.type === 'bulleted_list_item'" class="list">
            <li>{{ block.bulleted_list_item.rich_text?.[0]?.plain_text || '' }}</li>
          </ul>

          <ol v-else-if="block.type === 'numbered_list_item'" class="numbered-list">
            <li>{{ block.numbered_list_item.rich_text?.[0]?.plain_text || '' }}</li>
          </ol>

          <blockquote v-else-if="block.type === 'quote'" class="quote">
            {{ block.quote.rich_text?.[0]?.plain_text || '' }}
          </blockquote>

          <pre v-else-if="block.type === 'code'" class="code">
            <code>{{ block.code.rich_text?.[0]?.plain_text || '' }}</code>
          </pre>

          <figure v-else-if="block.type === 'image'" class="image">
            <img 
              :src="block.image.file?.url || block.image.external?.url" 
              :alt="block.image.caption?.[0]?.plain_text || ''"
            >
            <figcaption v-if="block.image.caption">
              {{ block.image.caption[0]?.plain_text }}
            </figcaption>
          </figure>
        </div>

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
    </article>

    <TableOfContents 
      v-if="headings.length > 0"
      :headings="headings" 
      class="toc-container"
    />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: post, error, pending } = await useFetch(`/api/posts/${route.params.slug}`, {
  onResponseError({ response }) {
    if (response.status === 404) {
      throw createError({
        statusCode: 404,
        message: '記事が見つかりません',
        fatal: true
      })
    }
  }
})

const currentUrl = computed(() => {
  if (process.client) {
    return window.location.href
  }
  return ''
})

const shareUrls = computed(() => ({
  twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.value?.metadata.title || '')}&url=${encodeURIComponent(currentUrl.value)}`,
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl.value)}`,
}))

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(currentUrl.value)
    alert('URLをコピーしました！')
  } catch (err) {
    console.error('URLのコピーに失敗しました:', err)
  }
}

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ja-JP')
}

const headings = computed(() => {
  if (!post.value?.content) return []
  
  return post.value.content
    .filter(block => ['heading_1', 'heading_2', 'heading_3'].includes(block.type))
    .map(block => {
      const level = parseInt(block.type.split('_')[1])
      const text = block[block.type].rich_text?.[0]?.plain_text || ''
      const id = `heading-${block.id}`
      return { id, text, level }
    })
})
</script>

<style scoped>
.post-container {
  display: grid;
  grid-template-columns: 1fr 250px;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.post-content {
  max-width: 800px;
}

.toc-container {
  display: none; /* モバイルでは非表示 */
}

/* デスクトップサイズで目次を表示 */
@media (min-width: 1024px) {
  .toc-container {
    display: block;
  }
}

/* 見出し要素のスタイル調整 */
:deep(.heading-1),
:deep(.heading-2),
:deep(.heading-3) {
  scroll-margin-top: 80px; /* 固定ヘッダーの高さに応じて調整 */
}

.content {
  margin-top: 2rem;
}

.paragraph {
  margin: 1rem 0;
  line-height: 1.8;
}

.heading-1 {
  font-size: 2em;
  font-weight: bold;
  margin: 2rem 0 1rem;
}

.heading-2 {
  font-size: 1.5em;
  font-weight: bold;
  margin: 1.5rem 0 1rem;
}

.heading-3 {
  font-size: 1.25em;
  font-weight: bold;
  margin: 1.25rem 0 1rem;
}

.list, .numbered-list {
  margin: 1rem 0;
  padding-left: 2rem;
}

.quote {
  margin: 1rem 0;
  padding: 1rem;
  border-left: 4px solid #ddd;
  background: #f9f9f9;
}

.code {
  margin: 1rem 0;
  padding: 1rem;
  background: #f1f1f1;
  border-radius: 4px;
  overflow-x: auto;
}

.image {
  margin: 2rem 0;
}

.image img {
  max-width: 100%;
  height: auto;
}

.image figcaption {
  text-align: center;
  color: #666;
  margin-top: 0.5rem;
}

.post-meta {
  margin: 1rem 0;
  color: #666;
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  background: #eee;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.thumbnail {
  margin: 2rem 0;
}

.thumbnail img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

/* スムーススクロールの設定 */
html {
  scroll-behavior: smooth;
}

@media (max-width: 1023px) {
  .post-container {
    grid-template-columns: 1fr;
  }
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
  font-size: 1.2rem;
  color: #666;
}

.error-container {
  min-height: 50vh;
}

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