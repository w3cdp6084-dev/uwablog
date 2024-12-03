<template>
  <div class="clap-container">
    <button 
      class="clap-button"
      :class="{ 'is-clapped': isLiked }"
      @click="toggleLike"
    >
      <div class="clap-icon">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 13.5V8L9 9.5M11 13.5L9 12M11 13.5L13 12M9 9.5L7 11L9 12M9 9.5L11 8M13 12L15 11L13 9.5L11 8"/>
          <path d="M3.5 8.5C1.5 11.5 1.5 15.5 3.5 18.5C5.5 21.5 9.5 21.5 12.5 19.5L15 17"/>
          <path d="M14 6.5L12 5L10.5 6.5"/>
        </svg>
      </div>
      <span class="clap-label">
        <span class="clap-text">Like this post</span>
        <span v-if="totalLikes > 0" class="clap-count">{{ totalLikes }}</span>
      </span>
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  slug: {
    type: String,
    required: true
  }
})

const isLiked = ref(false)
const totalLikes = ref(0)

// LocalStorageのキー
const storageKey = computed(() => `like_${props.slug}`)

// 初期化時にデータを読み込む
onMounted(async () => {
  // LocalStorageからいいね態を読み込む
  const stored = localStorage.getItem(storageKey.value)
  if (stored) {
    isLiked.value = JSON.parse(stored).isLiked
  }

  // サーバーから合計いいね数を取得
  await fetchLikes()
})

// いいね数を取得
const fetchLikes = async () => {
  try {
    const response = await fetch(`/api/likes/${props.slug}`)
    const data = await response.json()
    console.log('Fetched likes:', data)
    totalLikes.value = data.count
  } catch (error) {
    console.error('Failed to fetch likes:', error)
  }
}

// いいねの切り替え
const toggleLike = async () => {
  try {
    console.log('Sending like update...')
    const response = await fetch(`/api/likes/${props.slug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        increment: !isLiked.value
      })
    })
    const data = await response.json()
    console.log('Like update response:', data)
    totalLikes.value = data.count
    
    // LocalStorageの更新
    isLiked.value = !isLiked.value
    localStorage.setItem(storageKey.value, JSON.stringify({
      isLiked: isLiked.value
    }))

    // アニメーション
    if (isLiked.value) {
      playLikeAnimation()
    }
  } catch (error) {
    console.error('Failed to update likes:', error)
  }
}

// いいねアニメーション
const playLikeAnimation = () => {
  const button = document.querySelector('.clap-button')
  button.classList.add('animate-clap')
  setTimeout(() => {
    button.classList.remove('animate-clap')
  }, 700)
}
</script>

<style scoped>
.clap-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin: 2rem 0;
}

.clap-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  background: white;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.clap-button:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.clap-icon {
  width: 20px;
  height: 20px;
}

.clap-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #475569;
}

.clap-text {
  margin-right: 0.25rem;
}

.clap-count {
  font-weight: 600;
  color: #3b82f6;
}

.is-clapped {
  background: #f1f5f9;
  border-color: #cbd5e1;
  color: #475569;
}

/* アニメーション */
@keyframes clap-bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.animate-clap {
  animation: clap-bounce 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
</style> 