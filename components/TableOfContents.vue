<template>
  <nav class="toc">
    <div class="toc-title">目次</div>
    <ul class="toc-list">
      <li 
        v-for="(heading, index) in headings" 
        :key="index"
        :class="[
          'toc-item',
          `level-${heading.level}`,
          { active: currentHeading === heading.id }
        ]"
      >
        <a 
          :href="`#${heading.id}`"
          @click.prevent="scrollToHeading(heading.id)"
        >
          {{ heading.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
interface Heading {
  id: string
  text: string
  level: number
}

const props = defineProps<{
  headings: Heading[]
}>()

const currentHeading = ref<string>('')

// 見出しクリック時のスクロール処理
const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    // スクロール位置の調整（固定ヘッダーがある場合）
    const offset = 80 // 固定ヘッダーの高さに応じて調整
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// 現在の見出しの追跡を改善
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        currentHeading.value = entry.target.id
      }
    })
  }, {
    rootMargin: '-80px 0px -80% 0px' // 固定ヘッダーの高さに応じて調整
  })

  // 監視の設定
  setTimeout(() => {
    props.headings.forEach(heading => {
      const element = document.getElementById(heading.id)
      if (element) {
        observer.observe(element)
      }
    })
  }, 100)
})
</script>

<style scoped>
.toc {
  position: sticky;
  top: 80px; /* 固定ヘッダーの高さに応じて調整 */
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  padding: 1rem;
  background: #fff;
  border-left: 1px solid #eee;
  font-size: 0.9rem;
}

.toc-title {
  font-weight: bold;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin: 0.5rem 0;
}

.toc-item a {
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
}

.toc-item a:hover {
  color: #000;
}

.toc-item.active a {
  color: #3b82f6;
  font-weight: 500;
}

.level-1 {
  margin-left: 0;
}

.level-2 {
  margin-left: 1rem;
}

.level-3 {
  margin-left: 2rem;
}
</style> 