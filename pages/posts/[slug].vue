<template>
  <article class="post-container">
    <div class="post-main">
      <header class="post-header">
        <h1 class="post-title">{{ post.metadata.title }}</h1>
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
      <div class="mobile-toc-wrapper">
          <TableOfContents 
            v-if="headings.length > 0"
            :headings="headings" 
          />
        </div>
      <div class="post-content">
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

        <div v-if="relatedPosts?.length" class="related-posts">
          <h2 class="related-title">関連記事</h2>
          <div class="related-grid">
            <NuxtLink 
              v-for="relatedPost in relatedPosts" 
              :key="relatedPost.slug"
              :to="`/posts/${relatedPost.slug}`"
              class="related-post"
            >
              <img 
                v-if="relatedPost.thumbnail" 
                :src="relatedPost.thumbnail" 
                :alt="relatedPost.title"
                class="related-thumbnail"
              >
              <div class="related-content">
                <h3 class="related-post-title">{{ relatedPost.title }}</h3>
                <time class="related-date">{{ formatDate(relatedPost.date) }}</time>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <TableOfContents 
      v-if="headings.length > 0"
      :headings="headings" 
      class="post-toc desktop-only"
    />

    <div class="post-actions">
      <LikeButton :slug="post.slug" />
    </div>
  </article>
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

const relatedPosts = ref([])

console.log('Current post tags:', post.value?.metadata.tags)

watchEffect(async () => {
  if (post.value?.metadata.tags?.[0]) {
    try {
      const { data } = await useFetch('/api/posts/related', {
        query: {
          tag: post.value.metadata.tags[0],
          currentSlug: route.params.slug
        }
      })
      console.log('Related posts:', data.value)
      relatedPosts.value = data.value
    } catch (err) {
      console.error('Failed to fetch related posts:', err)
    }
  }
})
</script>

<style scoped>
.post-container {
  max-width: 800px;
  margin: 80px auto 40px;
  padding: 2rem;
  position: relative;
}

.post-main {
  width: 100%;
}

.post-header {
  margin-bottom: 2rem;
}

.post-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.post-meta {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.post-toc {
  position: absolute;
  top: 2rem;
  left: 100%;
  margin-left: 2rem;
}

.mobile-toc-wrapper {
  display: none;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

@media (max-width: 1200px) {
  .post-container {
    padding: 1rem;
  }

  .post-title {
    font-size: 1.75rem;
  }

  .desktop-only {
    display: none;
  }

  .mobile-toc-wrapper {
    display: block;
  }
}

.post-content {
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

.related-posts {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid #eaeaea;
}

.related-title {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.related-post {
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s;
}

.related-post:hover {
  transform: translateY(-3px);
}

.related-thumbnail {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.related-post-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.related-date {
  font-size: 0.875rem;
  color: #666;
}

@media (max-width: 768px) {
  .related-grid {
    grid-template-columns: 1fr;
  }
  
  .related-thumbnail {
    height: 200px;
  }
}

.post-actions {
  margin-top: 3rem;
  display: flex;
  justify-content: center;
}
</style> 