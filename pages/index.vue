<template>
  <div class="container">
    <!-- Post Filter -->
    <PostFilter 
      :availableTags="availableTags"
      @filter="handleFilter"
    />

    <div class="posts-list">
      <div
        v-for="post in currentPosts" 
        :key="post.slug"
        class="posts-list_item"
      >
        <article class="blog-listItem">
          <NuxtLink :to="`/posts/${post.slug}`" class="blog-listItem_anchor bouncy">
            <div class="blog-listItem_thumbnail">
              <div 
                v-if="post.thumbnail" 
                class="blog-listItem_image lazy"
                :data-bg="post.thumbnail"
              ></div>
              <div v-else class="blog-listItem_image blog-listItem_image-logo"></div>
              <div class="blog-listItem_date">
                <span class="pxtx pxtx-rendered">{{ formatDateShort(post.date) }}</span>
              </div>
            </div>
            <div class="blog-listItem_text">
              <div class="blog-listItem_title">{{ post.title }}</div>
            </div>
          </NuxtLink>
        </article>
      </div>
    </div>

    <!-- ページネーション -->
    <div v-if="totalPages > 1" class="pagination">
      <span class="page-info">{{ currentPage }} of {{ totalPages }} | </span>
      <NuxtLink 
        v-if="currentPage > 1"
        :to="{ query: { page: currentPage - 1 === 1 ? undefined : currentPage - 1 }}"
        class="page-link"
      >
        prev
      </NuxtLink>
      <span v-else class="page-link disabled">prev</span>
      <span class="separator"> / </span>
      <NuxtLink 
        v-if="currentPage < totalPages"
        :to="{ query: { page: currentPage + 1 }}"
        class="page-link"
      >
        next
      </NuxtLink>
      <span v-else class="page-link disabled">next</span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUpdated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PostFilter from '@/components/PostFilter.vue'
import { useBouncy } from '@/composables/useBouncy'
import { usePixelText } from '@/composables/usePixelText'

// データフェッチ
const { data: posts } = await useFetch('/api/posts')

const route = useRoute()
const router = useRouter()

const postsPerPage = 9
const currentPage = ref(1)

// フィルター状態
const searchQuery = ref('')
const selectedTags = ref([])

// 利用可能なタグを取得
const availableTags = computed(() => {
  if (!posts.value) return []
  const tags = posts.value.flatMap(post => post.tags || [])
  return [...new Set(tags)]
})

// フィルタリングされた記事
const filteredPosts = computed(() => {
  if (!posts.value) return []
  
  return posts.value.filter(post => {
    // 検索クエリでフィルタリング
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      const matchesTitle = post.title.toLowerCase().includes(query)
      const matchesDescription = post.description?.toLowerCase().includes(query)
      if (!matchesTitle && !matchesDescription) return false
    }
    
    // タグでフィルタリング
    if (selectedTags.value.length > 0) {
      const postTags = post.tags || []
      const hasAllTags = selectedTags.value.every(tag => postTags.includes(tag))
      if (!hasAllTags) return false
    }
    
    return true
  })
})


// 並び替えを適用した記事一覧
const sortedPosts = computed(() => {
  if (!filteredPosts.value) return []
  
  return [...filteredPosts.value].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    
    return dateB - dateA  // 最新順
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
  
  // 終端が調整された場合、開始点も調整
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
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}

const formatDateShort = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const handlePageChange = (page) => {
  currentPage.value = page
}

watch(() => route.query.page, (newPage) => {
  const page = Number(newPage) || 1
  if (page >= 1 && page <= totalPages.value) {
    handlePageChange(page)
  }
}, { immediate: true })

watch(currentPage, (newPage) => {
  router.push({
    query: {
      ...route.query,
      page: newPage === 1 ? undefined : newPage.toString()
    }
  })
})

// フィルター変更時の処理
const handleFilter = ({ query, tags }) => {
  searchQuery.value = query
  selectedTags.value = tags
  currentPage.value = 1 // フィルター変更時は1ページ目に戻る
}

// フィルター変更時にページ数をリセット
watch([searchQuery, selectedTags], () => {
  if (currentPage.value > totalPages.value && totalPages.value > 0) {
    currentPage.value = 1
  }
})

// Bouncyシステムとピクセルテキストの初期化
const { initBouncy, checkSafari } = useBouncy()
const { initPixelText } = usePixelText()

// 画像の遅延読み込み
const initLazyLoading = () => {
  const lazyImages = document.querySelectorAll('.lazy:not(.lazy-loaded)')
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        if (img.dataset.bg) {
          img.style.backgroundImage = `url(${img.dataset.bg})`
        }
        img.classList.add('lazy-loaded')
        observer.unobserve(img)
      }
    })
  })
  
  lazyImages.forEach(img => imageObserver.observe(img))
}

onMounted(() => {
  checkSafari()
  initBouncy()
  initLazyLoading()
})

onUpdated(() => {
  // ページ切り替え時に新しい要素に対して再初期化
  initBouncy()
  initLazyLoading()
})



</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
}

/* Posts List Style from cocopon.me */
.posts-list {
  align-items: flex-start;
  display: grid;
  gap: 42px;
  grid-template-columns: repeat(auto-fill, 288px);
  justify-content: center;
  margin: 2rem 0;
}

@media screen and (max-width: 479px) {
  .posts-list {
    align-items: center;
    display: flex;
    flex-direction: column;
  }
}

.posts-list_item {
  position: relative;
}

/* Blog List Item Styles from cocopon.me */
.blog-listItem {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  width: 288px;
  transition: box-shadow 0.2s ease;
}

.blog-listItem:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* ホバー時のポインター */
.blog-listItem_anchor {
  cursor: pointer;
}

.blog-listItem_anchor {
  display: block;
  text-decoration: none;
  color: inherit;
  outline: none;
  width: 100%;
}

.blog-listItem_thumbnail {
  background-color: var(--border-color);
  height: 0;
  overflow: hidden;
  padding-top: 66.67%; /* 3:2 aspect ratio */
  position: relative;
  width: 100%;
}

.blog-listItem_image {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  bottom: 0;
  filter: saturate(0%);
  left: 0;
  opacity: 0;
  position: absolute;
  right: 0;
  top: 0;
  transform: scale(1.01);
  transition: filter .4s ease, opacity .4s ease;
}

.blog-listItem_image.blog-listItem_image-logo {
  background-image: url(/assets/img/common/logo.svg);
  background-size: 30%;
  opacity: .3;
}

.blog-listItem_image.lazy-loaded {
  opacity: .5;
}

.safari .blog-listItem_image {
  filter: none;
}

.blog-listItem_anchor.bouncy.bouncy-active .blog-listItem_image {
  filter: none;
  opacity: 1;
}

.blog-listItem_date {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background-color: rgba(255, 107, 43, 0.9);
  color: white;
  padding: 4px 8px;
  font-size: 0.75rem;
  border-radius: 4px;
  font-weight: 500;
  z-index: 1;
}

.blog-listItem_text {
  padding: 1rem;
}

.blog-listItem_title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-color);
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Pixel Text Base Style */
.pxtx {
  background-color: currentColor;
  height: calc(var(--px-scale) * 5px);
  image-rendering: pixelated;
  mask-repeat: repeat-x;
  -webkit-mask-repeat: repeat-x;
  mask-position: left top;
  -webkit-mask-position: left top;
  mask-size: auto 100%;
  -webkit-mask-size: auto 100%;
  overflow: hidden;
  text-indent: -100vw;
}

/* タイトルのホバー時の色変更のみ */
.blog-listItem_anchor.bouncy-active .blog-listItem_title {
  color: var(--primary-color);
}


/* ページネーションのスタイル */
.pagination {
  margin: 3rem 0;
  padding: 2rem 0;
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.page-info {
  color: var(--text-secondary);
}

.page-link {
  color: var(--primary-color);
  text-decoration: none;
}

.page-link:hover {
  text-decoration: underline;
}

.page-link.disabled {
  color: var(--text-secondary);
  cursor: default;
}

.page-link.disabled:hover {
  text-decoration: none;
}

.separator {
  color: var(--text-secondary);
  margin: 0 0.25rem;
}
</style>