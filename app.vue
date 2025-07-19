<template>
  <div class="app-wrapper">
    <Header />
    <div class="page-content">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
    <Footer />
    <BouncyCursor />
  </div>
</template>

<script setup>
import BouncyCursor from '~/components/BouncyCursor.vue'
</script>

<style>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>