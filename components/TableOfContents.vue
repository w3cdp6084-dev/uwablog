<template>
  <div class="toc-container">
    <!-- モバイル用（シンプルな表示） -->
    <div class="mobile-only">
      <h2 class="toc-title">Index</h2>
      <nav class="toc-nav">
        <ul>
          <li 
            v-for="heading in headings" 
            :key="heading.id"
            :class="[
              'toc-item',
              `level-${heading.level}`
            ]"
          >
            <a 
              :href="`#${heading.id}`"
              class="toc-link"
              @click.prevent="scrollToHeading(heading.id)"
            >
              {{ heading.text }}
            </a>
          </li>
        </ul>
      </nav>
    </div>

    <!-- デスクトップ用 -->
    <div class="toc-content desktop-only">
      <div class="toc-sticky">
        <h2 class="toc-title">Index</h2>
        <nav class="toc-nav">
          <ul>
            <li 
              v-for="heading in headings" 
              :key="heading.id"
              :class="[
                'toc-item',
                `level-${heading.level}`
              ]"
            >
              <a 
                :href="`#${heading.id}`"
                class="toc-link"
                @click.prevent="scrollToHeading(heading.id)"
              >
                {{ heading.text }}
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  headings: Array<{
    id: string;
    text: string;
    level: number;
  }>;
}>();

const isFixed = ref(false)

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  const scrollPosition = window.scrollY
  isFixed.value = scrollPosition > 100 // スクロール位置が100pxを超えたら固定
}

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    const offset = 80 // ヘッダーの高さ分を調整
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}
</script>

<style scoped>
.toc-container {
  position: relative;
}

.toc-content {
  width: 240px;
}

.toc-sticky {
  position: sticky;
  top: 80px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  overflow: hidden;
}

.toc-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.toc-nav {
  max-height: calc(100vh - 160px);
  overflow-y: auto;
  padding: 1rem;
}

.toc-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-item {
  margin: 0.75rem 0;
}

.toc-link {
  color: var(--text-color);
  text-decoration: none;
  display: block;
  padding: 0.25rem 0;
  transition: color 0.2s;
  font-size: 0.9rem;
  line-height: 1.4;
}

.toc-link:hover {
  color: var(--accent-color);
}

/* 見出しレベルに応じたインデント */
.level-2 {
  padding-left: 0;
}

.level-3 {
  padding-left: 1rem;
}

.level-4 {
  padding-left: 2rem;
}

.mobile-only {
  display: none;
}

.desktop-only {
  display: block;
}

/* モバイル対応 */
@media (max-width: 1200px) {
  .mobile-only {
    display: block;
  }

  .desktop-only {
    display: none;
  }

  .toc-container {
    margin: 0;
    border: none;
    border-radius: 0;
  }

  .toc-title {
    padding: 0 0 1rem 0;
    border-bottom: none;
    font-size: 1.1rem;
  }

  .toc-nav {
    padding: 0;
  }
}
</style> 