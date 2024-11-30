<template>

    <header 
      class="l-header"
      :class="{ 
        'is-hidden': !isVisible,
        'is-scrolled': isScrolled 
      }"
    >
      <div class="logo">
        <a href="/">
          <img src="https://placehold.co/200x50" alt="Logo" />
        </a>
      </div>
      
      <div class="header-right">
        <ThemeToggle />
        <button 
          class="hamburger-btn" 
          :class="{ 'is-active': isMenuOpen }"
          @click="toggleMenu"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </header>

    <div class="menu" :class="{ 'is-open': isMenuOpen }">
      <nav class="menu-inner">
        <ul class="menu-list">
          <li><a href="/about">About</a></li>
          <li><a href="/projects">Projects</a></li>
          <li><a href="/member">Member</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    </div>

    <div 
      class="overlay" 
      :class="{ 'is-visible': isMenuOpen }"
      @click="closeMenu"
    ></div>
</template>

<script setup>
import { useMenuStore } from '~/stores/menu'
import ThemeToggle from './ThemeToggle.vue'

const menuStore = useMenuStore()
const isVisible = ref(true)
const isScrolled = ref(false)
const lastScrollPosition = ref(0)
const isToggling = ref(false)

// スクロール検出
const handleScroll = () => {
  const currentScrollPosition = window.scrollY
  
  isVisible.value = 
    currentScrollPosition < lastScrollPosition.value || 
    currentScrollPosition < 50

  isScrolled.value = currentScrollPosition > 50

  lastScrollPosition.value = currentScrollPosition
}

const toggleMenu = () => {
  if (isToggling.value) return
  isToggling.value = true
  
  menuStore.toggleMenu()
  console.log('Menu state:', menuStore.isMenuOpen)
  
  setTimeout(() => {
    isToggling.value = false
  }, 300)
}

const closeMenu = () => {
  menuStore.closeMenu()
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// メニューの状態をストアから取得
const isMenuOpen = computed(() => menuStore.isMenuOpen)
</script>

<style scoped>
.site-wrapper {
  position: relative;
  min-height: 100vh;
}

.l-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1rem;
  z-index: 50;
  background-color: var(--bg-color);
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.l-header.is-hidden {
  transform: translateY(-100%);
}

.l-header.is-scrolled {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.hamburger-btn {
  width: 30px;
  height: 20px;
  position: relative;
  z-index: 50;
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--text-color);
  transition: transform 0.3s;
}

.hamburger-line:nth-child(1) { top: 5px; }
.hamburger-line:nth-child(2) { bottom: 5px; }

.hamburger-btn.is-active .hamburger-line:nth-child(1) {
  transform: translateY(4px) rotate(45deg);
}

.hamburger-btn.is-active .hamburger-line:nth-child(2) {
  transform: translateY(-4px) rotate(-45deg);
}

.main-content {
  padding-top: 60px;
  transition: transform 0.3s;
  background-color: var(--bg-color);
}

.main-content.is-menu-open {
  transform: translateX(-300px);
}

.test-content {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.test-box {
  width: 100%;
  height: 200px;
  background-color: var(--menu-bg);
  margin: 2rem 0;
  border-radius: 8px;
}

.menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: var(--bg-color);
  transform: translateX(100%);
  transition: transform 0.3s;
  z-index: 40;
}

.menu.is-open {
  transform: translateX(0);
}

.menu-inner {
  padding: 100px 40px 40px;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  margin: 0 0 24px;
}

.menu-list a {
  display: block;
  font-size: 18px;
  color: var(--text-color);
  text-decoration: none;
  padding: 8px 0;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--overlay-bg);
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
  z-index: 30;
}

.overlay.is-visible {
  opacity: 1;
  visibility: visible;
}

@media (max-width: 768px) {
  .menu {
    width: 80vw;
  }

  .main-content.is-menu-open {
    transform: translateX(-80vw);
  }

  .test-box {
    height: 150px;
  }
}
</style>