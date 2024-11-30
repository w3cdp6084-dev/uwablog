<template>
  <div>
    <Loading v-if="isLoading" />
    <div v-else>
      <Header />
      <main>
        <NuxtPage />
      </main>
      <Footer />
    </div>
  </div>
</template>

<script setup>
const isLoading = ref(true)

// マウント時にローディングを制御
onMounted(() => {
  // ページの読み込みが完了したらローディングを終了
  window.addEventListener('load', () => {
    setTimeout(() => {
      isLoading.value = false
    }, 1000)
  })

  // バックアップとして、一定時間後に強制的にローディングを終了
  setTimeout(() => {
    isLoading.value = false
  }, 2000)
})
</script>

<style>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}
</style>