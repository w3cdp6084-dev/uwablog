<template>
  <div ref="cursorContainer" class="cursor-container">
    <svg
      ref="cursorSvg"
      class="cursor-svg"
      width="100"
      height="100"
      viewBox="0 0 100 100"
    >
      <polygon
        ref="cursorPolygon"
        :points="polygonPoints"
        fill="transparent"
      />
    </svg>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const cursorContainer = ref(null)
const cursorSvg = ref(null)
const cursorPolygon = ref(null)

const polygonPoints = ref('50,10 90,50 50,90 10,50')
const currentTarget = ref(null)
const isTouchDevice = ref(false)

let mouseX = 0
let mouseY = 0

// タッチデバイスかどうかを判定
const checkTouchDevice = () => {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

const handleMouseMove = (e) => {
  if (isTouchDevice.value) return
  
  mouseX = e.clientX
  mouseY = e.clientY
  
  if (!currentTarget.value) {
    gsap.to(cursorSvg.value, {
      duration: 0.3,
      x: mouseX - 50,
      y: mouseY - 50,
      ease: "power2.out"
    })
  }
}

const handleMouseEnter = (e) => {
  if (isTouchDevice.value) return
  
  const target = e.currentTarget
  if (!target.classList.contains('bouncy')) return
  
  currentTarget.value = target
  target.classList.add('bouncy-active')
  
  const rect = target.getBoundingClientRect()
  
  gsap.to(cursorSvg.value, {
    duration: 0.4,
    x: rect.left,
    y: rect.top,
    width: rect.width,
    height: rect.height,
    ease: "power2.out"
  })
  
  gsap.to(cursorPolygon.value, {
    duration: 0.4,
    attr: { points: `0,0 ${rect.width},0 ${rect.width},${rect.height} 0,${rect.height}` },
    ease: "power2.out"
  })
  
  const bgColor = getComputedStyle(target).getPropertyValue('--bg') || '#f0f0f0'
  gsap.to(cursorPolygon.value, {
    duration: 0.2,
    fill: bgColor,
    ease: "power2.out"
  })
}

const handleMouseLeave = (e) => {
  if (isTouchDevice.value) return
  
  const target = e.currentTarget
  if (!target.classList.contains('bouncy')) return
  
  target.classList.remove('bouncy-active')
  currentTarget.value = null
  
  gsap.to(cursorSvg.value, {
    duration: 0.4,
    x: mouseX - 50,
    y: mouseY - 50,
    width: 100,
    height: 100,
    ease: "power2.out"
  })
  
  gsap.to(cursorPolygon.value, {
    duration: 0.4,
    attr: { points: '50,10 90,50 50,90 10,50' },
    fill: 'transparent',
    ease: "power2.out"
  })
}

onMounted(() => {
  isTouchDevice.value = checkTouchDevice()
  
  if (isTouchDevice.value) {
    // タッチデバイスの場合、カーソルを非表示にする
    if (cursorContainer.value) {
      cursorContainer.value.style.display = 'none'
    }
    return
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  
  // すべての.bouncyクラスを持つ要素にイベントリスナーを追加
  const bouncyElements = document.querySelectorAll('.bouncy')
  bouncyElements.forEach(element => {
    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)
  })
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
  
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
  z-index: 9999;
}

.cursor-svg {
  position: absolute;
  pointer-events: none;
}
</style> 