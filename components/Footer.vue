<template>
  <footer class="footer">
    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} uwablog. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #1f2937;
  color: #f3f4f6;
  padding: 3rem 0 1.5rem;
  margin-top: 4rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 3rem;
}

.footer-section {
  margin-bottom: 2rem;
}

.footer-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #fff;
}

.footer-text {
  color: #9ca3af;
  line-height: 1.6;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: #9ca3af;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-links a:hover {
  color: #fff;
}

.footer-bottom {
  text-align: center;
  color: #9ca3af;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .footer-section {
    margin-bottom: 1rem;
  }
}
</style> 