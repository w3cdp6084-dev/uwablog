<template>
  <div class="loading-container">
    <div class="loading-spinner">
      <svg viewBox="0 0 50 50" class="spinner">
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
        />
      </svg>
    </div>
    <div class="loading-text">Loading...</div>
  </div>
</template>

<style scoped>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  z-index: 1000;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  margin-bottom: 1rem;
}

.spinner {
  animation: rotate 2s linear infinite;
}

.spinner circle {
  animation: dash 1.5s ease-in-out infinite;
  stroke-linecap: round;
}

.loading-text {
  font-size: 1.2rem;
  color: var(--text-color);
  font-weight: 500;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style> 