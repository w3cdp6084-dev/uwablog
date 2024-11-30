export default defineNuxtPlugin(() => {
  const loading = ref(true)

  // グローバルなローディング状態を管理
  const startLoading = () => loading.value = true
  const stopLoading = () => loading.value = false

  // アプリケーション全体で使用可能にする
  return {
    provide: {
      loading: {
        isLoading: loading,
        start: startLoading,
        stop: stopLoading
      }
    }
  }
}) 