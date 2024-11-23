<template>
  <div class="site-wrapper">
    <header class="l-header">
      <div class="logo">
        <a href="/">
          <img src="https://placehold.co/200x50" alt="Logo" />
        </a>
      </div>
      
      <div class="hamburger-wrapper">
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

    <nav class="menu" :class="{ 'is-open': isMenuOpen }">
      <ul class="menu-list">
        <li><a href="/">About</a></li>
        <li><a href="/projects">Projects</a></li>
        <li><a href="/member">Member</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </nav>

    <div 
      class="overlay" 
      :class="{ 'is-visible': isMenuOpen }"
      @click="closeMenu"
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMenuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    },
    closeMenu() {
      this.isMenuOpen = false;
      document.body.style.overflow = '';
    }
  },
};
</script>

<style scoped>
.site-wrapper {
  position: relative;
}

.l-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;
  z-index: 150;
}

.logo {
  position: relative;
  z-index: 1000;
}

.logo img {
  height: 24px;
  width: auto;
}

.hamburger-wrapper {
  position: relative;
  z-index: 200;
}

.hamburger-btn {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
}

.hamburger-line {
  display: block;
  width: 30px;
  height: 1px;
  background-color: #000;
  transition: transform 0.3s;
}

.hamburger-btn.is-active .hamburger-line:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.hamburger-btn.is-active .hamburger-line:nth-child(2) {
  transform: translateY(-9px) rotate(-45deg);
}

.main-content {
  padding-top: 80px;
  transition: transform 0.3s;
  min-height: 100vh;
  background: #fff;
}

.main-content.is-menu-open {
  transform: translateX(-300px);
}

.menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background: #fff;
  padding: 100px 40px;
  transition: transform 0.3s;
  z-index: 100;
  transform: translateX(100%);
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
}

.menu.is-open {
  transform: translateX(0);
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-list li {
  margin-bottom: 20px;
}

.menu-list a {
  color: #000;
  text-decoration: none;
  font-size: 1.2rem;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: 0.3s;
  z-index: 50;
}

.overlay.is-visible {
  opacity: 1;
  visibility: visible;
}

.test-content {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.test-box {
  width: 100%;
  height: 200px;
  background: #f0f0f0;
  margin: 2rem 0;
  border-radius: 8px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

p {
  margin-bottom: 1rem;
  line-height: 1.6;
}
</style>