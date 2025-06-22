<template>

    <header 
      class="l-header"
      :class="{ 
        'is-hidden': !isVisible,
        'is-scrolled': isScrolled 
      }"
    >
      <div class="header-container">
        <div class="header-left">
          <button 
            class="hamburger-btn" 
            :class="{ 'is-active': isMenuOpen }"
            @click="toggleMenu"
          >
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
        </div>
        
        <div class="logo">
          <a href="/">
            <img src="https://placehold.co/200x50" alt="Logo" />
          </a>
        </div>
        
        <div class="header-right">
          <ThemeToggle />
        </div>
      </div>
    </header>

    <div class="side-nav" :class="{ 'is-open': isMenuOpen }">
      <nav class="side-nav-inner">
        <button class="close-btn" @click="closeMenu">
          <span class="close-line"></span>
          <span class="close-line"></span>
        </button>
        
        <div class="nav-content">
          <div class="nav-group">
            <h3 class="nav-group-title">Main</h3>
            <ul class="nav-list">
              <li><NuxtLink to="/" @click="closeMenu">Home</NuxtLink></li>
              <li><NuxtLink to="/posts" @click="closeMenu">Posts</NuxtLink></li>
              <li><NuxtLink to="/about" @click="closeMenu">About</NuxtLink></li>
            </ul>
          </div>
          
          <div class="nav-group">
            <h3 class="nav-group-title">Categories</h3>
            <ul class="nav-list">
              <li><NuxtLink to="/tags/tech" @click="closeMenu">Tech</NuxtLink></li>
              <li><NuxtLink to="/tags/design" @click="closeMenu">Design</NuxtLink></li>
              <li><NuxtLink to="/tags/life" @click="closeMenu">Life</NuxtLink></li>
            </ul>
          </div>
          
          <div class="nav-social">
            <a href="#" target="_blank" rel="noopener">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="#" target="_blank" rel="noopener">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
              </svg>
            </a>
          </div>
        </div>
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
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 1rem;
  z-index: 50;
  background-color: var(--bg-color);
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1440px;
  position: relative;
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.logo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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
  justify-content: flex-end;
  flex: 1;
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
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  background-color: var(--bg-color);
}

.main-content.is-menu-open {
  transform: translateX(320px);
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

.side-nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  height: 100vh;
  background-color: #222;
  transform: translateX(-100%);
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 1000;
  border-radius: 0 32px 32px 0;
  overflow-y: auto;
}

.side-nav.is-open {
  transform: translateX(0);
}

.side-nav-inner {
  padding: 32px 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 24px;
  right: 24px;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;
}

.close-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 2px;
  background-color: #fff;
  transform-origin: center;
}

.close-line:nth-child(1) {
  transform: translate(-50%, -50%) rotate(45deg);
}

.close-line:nth-child(2) {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.nav-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-top: 60px;
}

.nav-group {
  margin-bottom: 32px;
}

.nav-group-title {
  color: #888;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 16px;
  padding-left: 4px;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-list li {
  margin-bottom: 8px;
}

.nav-list a {
  display: block;
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 12px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
}

.nav-list a:hover,
.nav-list a.router-link-active {
  background-color: rgba(255, 255, 255, 0.1);
  color: #FB6C24;
}

.nav-social {
  margin-top: auto;
  display: flex;
  gap: 16px;
  padding: 24px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-social a {
  color: #888;
  transition: color 0.2s ease;
}

.nav-social a:hover {
  color: #FB6C24;
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
  .side-nav {
    width: 90vw;
    border-radius: 0 24px 24px 0;
  }

  .main-content.is-menu-open {
    transform: translateX(90vw);
  }

  .test-box {
    height: 150px;
  }
  
  .nav-content {
    gap: 24px;
    margin-top: 40px;
  }
  
  .nav-group {
    margin-bottom: 24px;
  }
  
  .header-container {
    max-width: none;
    padding: 0 1rem;
  }
  
  .logo {
    position: static;
    transform: none;
    flex: 1;
    text-align: center;
  }
  
  .header-left,
  .header-right {
    flex: 0;
  }
}
</style>