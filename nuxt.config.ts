export default defineNuxtConfig({
  devtools: { enabled: true },

  css: [
    '@/assets/css/tailwind.css',
    '@/assets/css/global.css'
  ],

  app: {
    head: {
      script: [
        {
          innerHTML: `
            (function() {
              const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              document.documentElement.classList.toggle('dark', theme === 'dark');
            })()
          `,
          type: 'text/javascript'
        }
      ]
    }
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    notionApiKey: process.env.NOTION_API_KEY,
    notionDatabaseId: process.env.NOTION_DATABASE_ID
  },

  nitro: {
    compatibilityDate: '2024-11-25',
    moduleSideEffects: ['reflect-metadata'],
  },

  compatibilityDate: '2024-11-26',

  vite: {
    build: {
      rollupOptions: {
        external: ['punycode']
      }
    }
  },

  hooks: {
    'builder:watch': (event, path) => {
      if (process.env.NODE_ENV === 'development') {
        process.env.NODE_NO_WARNINGS = '1'
      }
    }
  }
})