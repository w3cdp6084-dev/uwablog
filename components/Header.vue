<template>
  <div class="site-wrapper">
    <header class="l-header">
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

    <main class="main-content" :class="{ 'is-menu-open': isMenuOpen }">
      <div class="test-content">
        <h1>メインコンテンツ</h1>
        <p>これはテスト用のコンテンツです。メニューを開くと左にスライドします。</p>
        <div class="test-box"></div>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <div class="test-box"></div>
        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </div>
    </main>

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
  </div>
</template>

<script>
import ThemeToggle from './ThemeToggle.vue'

export default {
  components: {
    ThemeToggle
  },
  data() {
    return {
      isMenuOpen: false,
      isToggling: false
    }
  },
  methods: {
    toggleMenu() {
      if (this.isToggling) return
      this.isToggling = true
      
      this.isMenuOpen = !this.isMenuOpen
      console.log('Menu state:', this.isMenuOpen)
      
      setTimeout(() => {
        this.isToggling = false
      }, 300)
    },
    closeMenu() {
      this.isMenuOpen = false;
    }
  }
}
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
  background-color: var(--menu-bg);
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