<template>
  <div ref="cursorContainer" class="cursor-container" v-if="!isTouchDevice">
    <!-- 背景エフェクト用の非表示要素 -->
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const cursorContainer = ref(null)
const isTouchDevice = ref(false)

// タッチデバイスかどうかを判定
const checkTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

const handleMouseEnter = (e) => {
  if (isTouchDevice.value) return
  
  const target = e.currentTarget
  if (!target.classList.contains('bouncy')) return
  
  target.classList.add('bouncy-active')
}

const handleMouseLeave = (e) => {
  if (isTouchDevice.value) return
  
  const target = e.currentTarget
  if (!target.classList.contains('bouncy')) return
  
  target.classList.remove('bouncy-active')
}

onMounted(() => {
  isTouchDevice.value = checkTouchDevice()
  
  if (isTouchDevice.value) {
    return
  }
  
  // すべての.bouncyクラスを持つ要素にイベントリスナーを追加
  const bouncyElements = document.querySelectorAll('.bouncy')
  bouncyElements.forEach(element => {
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
  })
})

onUnmounted(() => {
  if (isTouchDevice.value) return
  
  const bouncyElements = document.querySelectorAll('.bouncy')
  bouncyElements.forEach(element => {
    element.removeEventListener('mouseenter', handleMouseEnter)
    element.removeEventListener('mouseleave', handleMouseLeave)
  })
})
</script>

<style scoped>
.cursor-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -10;
}
</style> 