<script setup lang="ts">
// メタ情報の設定
useHead({
  title: 'About - Your Blog Name',
  meta: [
    { name: 'description', content: 'About me and this blog' }
  ]
})
</script>

<template>
  <div class="about-container">
    <!-- プロフィールセクション -->
    <section class="profile-section">
      <h1>About Me</h1>
      <div class="profile">
        <div class="profile-info">
          <h2>Your Name</h2>
          <p class="bio">
            簡単な自己紹介文をここに記載
          </p>
          <div class="social-links">
            <a href="https://github.com/yourusername" target="_blank" rel="noopener">GitHub</a>
            <a href="https://twitter.com/yourusername" target="_blank" rel="noopener">Twitter</a>
          </div>
        </div>
      </div>
    </section>

    <!-- ブログについて -->
    <section class="blog-section">
      <h2>About This Blog</h2>
      <p>ブログの目的や扱うトピックについての説明</p>
      <div class="blog-topics">
        <h3>主なトピック</h3>
        <ul>
          <li>技術記事</li>
          <li>開発日記</li>
          <li>学習記録</li>
        </ul>
      </div>
    </section>

    <!-- スキル・技術スタック -->
    <section class="skills-section">
      <h2>Skills & Technologies</h2>
      <div class="skills-grid">
        <div class="skill-category">
          <h3>Frontend</h3>
          <ul>
            <li>Vue.js / Nuxt.js</li>
            <li>React</li>
          </ul>
        </div>
        <div class="skill-category">
          <h3>Backend</h3>
          <ul>
            <li>Node.js</li>
            <li>Python</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- コンタクト -->
    <section class="contact-section">
      <h2>Contact</h2>
      <p>お問い合わせやご連絡は以下からお願いします：</p>
      <a href="mailto:your@email.com" class="contact-button">メールを送る</a>
    </section>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

section {
  margin-bottom: 3rem;
}

.profile {
  margin: 2rem 0;
}

.profile-info {
  flex: 1;
}

.social-links {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}

.social-links a {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: #f0f0f0;
  text-decoration: none;
  color: #333;
  transition: background 0.3s;
}

.social-links a:hover {
  background: #e0e0e0;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.skill-category ul {
  list-style: none;
  padding: 0;
}

.skill-category li {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

.skill-category li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #666;
}

.contact-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background: #333;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  margin-top: 1rem;
  transition: background 0.3s;
}

.contact-button:hover {
  background: #555;
}

@media (max-width: 768px) {
  .profile {
    text-align: center;
  }

  .social-links {
    justify-content: center;
  }
}
</style>