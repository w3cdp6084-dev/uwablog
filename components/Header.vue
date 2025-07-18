<template>
  <div>
    <header class="l-header">
      <div class="header-container">
        <div class="header-content">
          <div class="site-info">
            <h1 class="site-title">uwablog</h1>
            <p class="site-description">thoughts and notes</p>
          </div>
          <button 
            class="menu-button"
            @click="toggleMenu"
            aria-label="Menu"
          >
            <span class="menu-icon"></span>
            <span class="menu-icon"></span>
            <span class="menu-icon"></span>
          </button>
        </div>
      </div>
    </header>

    <!-- Side Sheet -->
    <div 
      class="side-sheet-overlay"
      :class="{ 'is-open': isMenuOpen }"
      @click="closeMenu"
    ></div>
    
    <div 
      class="side-sheet"
      :class="{ 'is-open': isMenuOpen }"
    >
      <div class="side-sheet-header">
        <button 
          class="close-button"
          @click="closeMenu"
          aria-label="Close menu"
        >
          <span class="close-icon"></span>
          <span class="close-icon"></span>
        </button>
      </div>
      
      <nav class="side-nav">
        <NuxtLink 
          to="/works" 
          class="nav-link"
          @click="closeMenu"
        >
          Works
        </NuxtLink>
        <NuxtLink 
          to="/" 
          class="nav-link"
          @click="closeMenu"
        >
          Blog
        </NuxtLink>
        <NuxtLink 
          to="/about" 
          class="nav-link"
          @click="closeMenu"
        >
          About
        </NuxtLink>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<style scoped>
.l-header {
  padding: 3rem 0 2rem;
  background-color: var(--bg-color);
  position: relative;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.site-info {
  flex: 1;
}

.site-title {
  font-size: 1.5rem;
  font-weight: normal;
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
}

.site-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Menu Button */
.menu-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  justify-content: center;
}

.menu-icon {
  display: block;
  width: 24px;
  height: 2px;
  background-color: var(--text-color);
  transition: transform 0.3s ease;
}

/* Side Sheet */
.side-sheet-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  z-index: 999;
}

.side-sheet-overlay.is-open {
  opacity: 1;
  visibility: visible;
}

.side-sheet {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100vh;
  background-color: var(--bg-color);
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
}

.side-sheet.is-open {
  right: 0;
}

.side-sheet-header {
  padding: 2rem;
  display: flex;
  justify-content: flex-end;
}

.close-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  position: relative;
  width: 32px;
  height: 32px;
}

.close-icon {
  position: absolute;
  width: 20px;
  height: 2px;
  background-color: var(--text-color);
  top: 50%;
  left: 50%;
}

.close-icon:first-child {
  transform: translate(-50%, -50%) rotate(45deg);
}

.close-icon:last-child {
  transform: translate(-50%, -50%) rotate(-45deg);
}

/* Side Navigation */
.side-nav {
  padding: 0 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.side-nav .nav-link {
  color: var(--text-color);
  text-decoration: none;
  font-size: 1.25rem;
  transition: color 0.2s ease;
  display: block;
  padding: 0.5rem 0;
}

.side-nav .nav-link:hover {
  color: var(--primary-color);
}

.side-nav .nav-link.router-link-exact-active {
  color: var(--primary-color);
  font-weight: 500;
}

@media (max-width: 768px) {
  .l-header {
    padding: 2rem 0 1.5rem;
  }
  
  .header-container {
    padding: 0 1rem;
  }
  
  .site-title {
    font-size: 1.25rem;
  }
  
  .side-sheet {
    width: 280px;
    right: -280px;
  }
}
</style>