<template>
    <button class="theme-toggle" @click="toggleTheme" aria-label="Toggle theme">
      <!-- 月のアイコン -->
      <svg v-if="!isDark" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
      <!-- 太陽のアイコン -->
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    </button>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isDark: false
      }
    },
    mounted() {
      // 初期値の設定
      this.isDark = document.documentElement.classList.contains('dark')
      
      // システムのカラーモード変更を監視
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.onSystemThemeChange)
    },
    beforeDestroy() {
      // イベントリスナーの削除
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', this.onSystemThemeChange)
    },
    methods: {
      async toggleTheme() {
        try {
          this.isDark = !this.isDark
          document.documentElement.classList.toggle('dark')
          await localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
          console.log('Dark mode:', this.isDark)
          console.log('Classes:', document.documentElement.classList)
        } catch (error) {
          console.error('Theme toggle error:', error)
        }
      },
      onSystemThemeChange(e) {
        this.isDark = e.matches
        document.documentElement.classList.toggle('dark', e.matches)
      }
    }
  }
  </script>
  
  <style scoped>
  .theme-toggle {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color);
  }
  
  .theme-toggle:hover {
    opacity: 0.8;
  }
  </style>