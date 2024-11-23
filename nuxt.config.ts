export default defineNuxtConfig({
  css: [
    '@/assets/css/tailwind.css',
    '@/assets/css/global.css',
  ],
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },
});