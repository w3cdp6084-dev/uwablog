<template>
  <div class="post-detail">
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

          <h2 v-else-if="block.type === 'heading_1'" class="heading-1">
            {{ block.heading_1.rich_text?.[0]?.plain_text || '' }}
          </h2>

          <h3 v-else-if="block.type === 'heading_2'" class="heading-2">
            {{ block.heading_2.rich_text?.[0]?.plain_text || '' }}
          </h3>

          <h4 v-else-if="block.type === 'heading_3'" class="heading-3">
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
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: post, error } = await useFetch(`/api/posts/${route.params.slug}`, {
  key: route.params.slug as string
})

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ja-JP')
}
</script>

<style scoped>
.post-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
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
</style> 