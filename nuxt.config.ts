export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    ['@pinia/nuxt', {
      autoImports: ['defineStore', 'storeToRefs']
    }]
  ],

  imports: {
    dirs: ['stores']
  },

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
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Poppins:wght@400;500;600;700&display=swap'
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
    notionApiKey: process.env.NOTION_API_KEY || 'secret_qpWR4x102mf7bOvDfx3jICv1akEvEq2jPZgAtMfsQva',
    notionDatabaseId: process.env.NOTION_DATABASE_ID || '1dc23cc04e6e46ca9c311fa8b1812c9d'
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
  },
})