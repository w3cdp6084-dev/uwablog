<template>
  <footer class="footer">
    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} uwablog. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--bg-color);
  color: var(--text-secondary);
  padding: 3rem 0 2rem;
  margin-top: 6rem;
  border-top: 1px solid var(--border-color);
}

.footer-bottom {
  text-align: center;
  font-size: 0.875rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

@media (max-width: 768px) {
  .footer {
    padding: 2rem 0 1.5rem;
    margin-top: 4rem;
  }
  
  .footer-bottom {
    padding: 0 1rem;
  }
}
</style> 