<template>
  <div class="container">
    <div class="tag-header">
      <h1 class="tag-title">
        <span class="tag-icon">#</span>
        {{ $route.params.tag }}
      </h1>
      <p class="tag-description">
        「{{ $route.params.tag }}」タグの記事一覧 ({{ filteredPosts.length }}件)
      </p>
    </div>

    <!-- PostFilterコンポーネントの使用 -->
    <PostFilter 
      :availableTags="availableTags"
      :preselectedTags="[$route.params.tag]"
      @search="handleSearch"
      @sort="handleSort"
      @viewChange="handleViewChange"
    />

    <div class="posts-container" :class="viewMode">
      <div 
        v-for="post in currentPosts" 
        :key="post.slug"
        class="cube-container"
      >
        <NuxtLink :to="`/posts/${post.slug}`" class="cube-card">
          <div class="cube-item-name">
            <span>{{ post.tags?.[0] || 'Article' }}</span>
          </div>
          <div class="outer-block">
            <span>{{ post.title }}</span>
          </div>
          <div class="cube-image-wrapper">
            <img 
              v-if="post.thumbnail" 
              :src="post.thumbnail" 
              :alt="post.title"
              class="cube-image intro-animation"
            >
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- 記事が見つからない場合 -->
    <div v-if="filteredPosts.length === 0" class="no-posts">
      <p>「{{ $route.params.tag }}」タグの記事が見つかりませんでした。</p>
      <NuxtLink to="/" class="back-link">トップページに戻る</NuxtLink>
    </div>

    <!-- ページネーション -->
    <div v-if="totalPages > 1" class="pagination">
      <button 
        @click="handlePageChange(currentPage - 1)"
        :disabled="currentPage === 1"
        class="pagination-btn prev"
      >
        ← 前へ
      </button>
      
      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="handlePageChange(page)"
          :class="['page-btn', { active: page === currentPage }]"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        @click="handlePageChange(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="pagination-btn next"
      >
        次へ →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostFilter from '@/components/PostFilter.vue'

const route = useRoute()
const router = useRouter()

// データフェッチ
const { data: posts } = await useFetch('/api/posts')

const postsPerPage = 9
const currentPage = ref(1)

// 現在のタグでフィルタリングされた記事
const filteredPosts = computed(() => {
  if (!posts.value) return []
  const currentTag = route.params.tag
  return posts.value.filter(post => 
    post.tags?.includes(currentTag)
  )
})

// 利用可能なタグを取得
const availableTags = computed(() => {
  if (!posts.value) return []
  return [...new Set(posts.value.flatMap(post => post.tags || []))]
})

// 検索フィルターの状態
const searchFilters = ref({
  query: '',
  tags: [route.params.tag] // 現在のタグを初期値に設定
})

// さらにフィルタリングされた記事（検索条件適用後）
const searchFilteredPosts = computed(() => {
  return filteredPosts.value.filter(post => {
    // キーワード検索
    if (searchFilters.value.query) {
      const query = searchFilters.value.query.toLowerCase()
      const matchesTitle = post.title.toLowerCase().includes(query)
      const matchesDescription = post.description?.toLowerCase().includes(query)
      if (!matchesTitle && !matchesDescription) return false
    }

    // 追加タグフィルター
    if (searchFilters.value.tags.length > 1) {
      // 現在のタグ以外の追加フィルター
      const additionalTags = searchFilters.value.tags.filter(tag => tag !== route.params.tag)
      if (additionalTags.length > 0) {
        if (!additionalTags.every(tag => post.tags?.includes(tag))) {
          return false
        }
      }
    }

    return true
  })
})

const sortOrder = ref('newest')
const viewMode = ref('grid')

// 並び替えを適用した記事一覧
const sortedPosts = computed(() => {
  if (!searchFilteredPosts.value) return []
  
  return [...searchFilteredPosts.value].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    
    return sortOrder.value === 'newest' 
      ? dateB - dateA  // 最新順
      : dateA - dateB  // 古い順
  })
})

// ページネーション用の記事取得
const currentPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return sortedPosts.value.slice(start, end)
})

// 総ページ数の計算
const totalPages = computed(() => {
  return Math.ceil(sortedPosts.value.length / postsPerPage)
})

// 表示するページ番号を計算
const visiblePages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  const half = Math.floor(maxVisiblePages / 2)
  
  let start = Math.max(1, currentPage.value - half)
  let end = Math.min(totalPages.value, start + maxVisiblePages - 1)
  
  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ja-JP')
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const handleSort = (order) => {
  sortOrder.value = order
}

const handleViewChange = (mode) => {
  viewMode.value = mode
}

// 検索イベントのハンドラー
const handleSearch = ({ query, tags }) => {
  searchFilters.value.query = query
  searchFilters.value.tags = tags
  currentPage.value = 1
}

// ルートが変更された時の処理
watch(() => route.params.tag, (newTag) => {
  if (newTag) {
    searchFilters.value.tags = [newTag]
    currentPage.value = 1
  }
}, { immediate: true })

// SEO設定
useSeoMeta({
  title: `${route.params.tag} - タグ一覧`,
  description: `「${route.params.tag}」タグの記事一覧ページです。`
})
</script>

<style scoped>
.container {
  max-width: 1440px;
  margin: 120px auto 0; 
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

.tag-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
  border-bottom: 1px solid var(--color-border);
}

.tag-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.tag-icon {
  color: #FB6C24;
  font-weight: 900;
}

.tag-description {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

/* JR East CubeContainer - Accurate Implementation */
.posts-container {
  margin: 2rem 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(335px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

@media (min-width: 768px) {
  .posts-container {
    gap: 1rem;
  }
}

@media (min-width: 1025px) {
  .posts-container {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
    padding: 1rem;
  }
}

/* CubeItem - Main Container */
.cube-container {
  position: relative;
  width: 100%;
  aspect-ratio: 335/250;
  overflow: hidden;
}

@media (min-width: 1025px) {
  .cube-container {
    border-radius: 1.5625rem 1.25rem 1.25rem 1.25rem;
  }
}

@media (max-width: 1024px) {
  .cube-container {
    border-radius: 1.25rem;
  }
}

/* Blur Shadow - Always Present */
@media (min-width: 1025px) {
  .cube-container:before {
    content: "";
    width: 21.5625rem;
    height: 22.625rem;
    transform-origin: top center;
    opacity: 0;
    transform: scaleY(0);
    background-color: #006c02;
    filter: blur(0.9375rem);
    border-radius: 0.625rem;
    position: absolute;
    left: -0.375rem;
    top: 0.875rem;
    z-index: 0;
    pointer-events: none;
    transition: opacity 0.3s cubic-bezier(0.19, 1, 0.22, 1), transform 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  }
}

/* Hover Effects - Desktop Only */
@media screen and (hover: hover) and (min-width: 1025px) {
  .cube-container:hover {
    z-index: 3;
  }

  .cube-container:hover:before {
    transform: scaleY(1);
    opacity: 0.15;
    transition: opacity 0.2s cubic-bezier(0.215, 0.61, 0.355, 1), transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  /* Green Overlay Expansion */
  .cube-container:hover .outer-block {
    transition: clip-path 0.3s cubic-bezier(0.19, 1, 0.22, 1) 0.01s;
    clip-path: inset(0px 0px 0px 0px round 1.25rem);
  }

  /* Item Name Color Change */
  .cube-container:hover .cube-item-name {
    transition: background-color 0s cubic-bezier(0.19, 1, 0.22, 1);
    background-color: #008803;
    color: #fff;
  }

  .cube-container:hover .cube-item-name span {
    color: #fff;
  }

  .cube-container:hover .cube-item-name span:before {
    background-color: #fff;
  }
}

.cube-card {
  display: block;
  width: 100%;
  height: 100%;
  text-decoration: none;
  color: inherit;
  position: relative;
}

/* Green Overlay Block */
.outer-block {
  position: absolute;
  left: -1rem;
  top: -1rem;
  width: calc(100% + 2rem);
  height: calc(100% + 2rem);
  background-color: #008803;
  color: #fff;
  border-radius: 1.25rem;
  z-index: 1;
  transition: clip-path 0.3s cubic-bezier(0.19, 1, 0.22, 1);
  clip-path: inset(1.0625rem 1.0625rem 7.125rem 1.0625rem round 1.25rem);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 1.875rem;
  font-size: 0.8125rem;
  line-height: 1.8;
  text-align: center;
}

@media (max-width: 1024px) {
  .outer-block {
    display: none;
  }
}

/* Item Name - Top Left Tag */
.cube-item-name {
  display: flex;
  align-items: center;
  position: absolute;
  z-index: 2;
  left: -0.0625rem;
  top: -0.0625rem;
  padding: 1.3125rem 1.5625rem 1.25rem 2.875rem;
  border-radius: 1.25rem 0 0 0;
  background-color: #fff;
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  transition: background-color 0s cubic-bezier(0.19, 1, 0.22, 1) 0.06s;
}

@media (max-width: 1024px) {
  .cube-item-name {
    padding: 1.3125rem 1.25rem 1.25rem 2.25rem;
    font-size: 0.8125rem;
    letter-spacing: 0.024375rem;
  }
}

.cube-item-name span {
  position: relative;
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 600;
  transition: color 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
}

.cube-item-name span:before {
  content: "";
  background-color: #008803;
  border-radius: 50%;
  width: 0.5625rem;
  height: 0.5625rem;
  position: absolute;
  top: 50%;
  right: 100%;
  margin-right: 0.625rem;
  margin-top: -0.28125rem;
  transition: background-color 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
}

@media (min-width: 1025px) {
  .cube-container:hover .cube-item-name {
    background-color: #008803;
    color: #fff;
    transition: background-color 0s cubic-bezier(0.19, 1, 0.22, 1);
  }
  
  .cube-container:hover .cube-item-name span {
    color: #fff;
  }
  
  .cube-container:hover .cube-item-name span:before {
    background-color: #fff;
  }
}

/* Image Wrapper */
.cube-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #cbe2d3 0%, #e2f1e7 59.5%);
  border-radius: inherit;
  overflow: hidden;
  z-index: 1;
}

.cube-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1);
  transform: translate3d(0, 100%, 0);
}

.cube-image.intro-animation,
.cube-image.is-intersect {
  transform: translateZ(0);
  transition: transform 1s cubic-bezier(0.19, 1, 0.22, 1);
}

/* Clean JR East Style - Remove unused elements */

.no-posts {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.back-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #FB6C24;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.back-link:hover {
  background-color: #e55a1f;
}

/* List view maintains cube style but with adjusted aspect ratio */
.posts-container.list {
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.posts-container.list .cube-container {
  aspect-ratio: 16/9;
}

@media (min-width: 768px) {
  .posts-container.list {
    grid-template-columns: 1fr;
  }
  
  .posts-container.list .cube-container {
    aspect-ratio: 21/9;
  }
}

/* ページネーションのスタイル */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 3rem 0 2rem;
  padding: 1rem;
}

.pagination-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid #ddd;
  background-color: #fff;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  min-width: 100px;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #FB6C24;
  color: white;
  border-color: #FB6C24;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background-color: #f5f5f5;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-btn {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  background-color: #fff;
  color: #333;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  transition: all 0.3s ease;
}

.page-btn:hover {
  background-color: #f8f9fa;
  border-color: #FB6C24;
}

.page-btn.active {
  background-color: #FB6C24;
  color: white;
  border-color: #FB6C24;
}

/* モバイル対応 */
@media (max-width: 640px) {
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pagination-btn {
    min-width: 120px;
  }
  
  .page-numbers {
    order: -1;
  }
  
  .tag-title {
    font-size: 2rem;
  }
}
</style>