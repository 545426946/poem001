<template>
  <div class="appreciation-container">
    <!-- 导航栏 -->
    <nav class="poetry-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <router-link to="/" class="brand-link">
            <h1 class="brand-title">古韵诗香</h1>
          </router-link>
          <span class="brand-subtitle">诗词赏析</span>
        </div>
        <ul class="nav-menu">
          <li><router-link to="/" class="nav-link">首页</router-link></li>
          <li><router-link to="/poems" class="nav-link">诗词库</router-link></li>
          <li><router-link to="/poets" class="nav-link">诗人</router-link></li>
          <li><router-link to="/appreciation" class="nav-link">赏析</router-link></li>
          <li><router-link to="/about" class="nav-link">关于</router-link></li>
        </ul>
      </div>
    </nav>

    <!-- 主要内容 -->
    <main class="appreciation-main">
      <div class="container">
        <!-- 赏析文章列表 -->
        <div class="articles-grid">
          <article class="article-card" v-for="article in articles" :key="article.id">
            <div class="article-image">
              <div class="image-placeholder">{{ article.poemTitle.charAt(0) }}</div>
            </div>
            <div class="article-content">
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-poem">{{ article.poemTitle }} - {{ article.poetName }}</p>
              <p class="article-summary">{{ article.summary }}</p>
              <div class="article-meta">
                <span class="meta-item">阅读时间: {{ article.readTime }}</span>
                <span class="meta-item">难度: {{ article.difficulty }}</span>
              </div>
              <router-link :to="`/appreciation/${article.id}`" class="read-article">阅读全文</router-link>
            </div>
          </article>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Appreciation',
  data() {
    return {
      articles: [
        {
          id: 1,
          title: '《静夜思》中的思乡情怀',
          poemTitle: '静夜思',
          poetName: '李白',
          summary: '分析李白在《静夜思》中如何通过明月意象表达深切的思乡之情...',
          readTime: '5分钟',
          difficulty: '初级'
        },
        {
          id: 2,
          title: '《春晓》的自然美学',
          poemTitle: '春晓',
          poetName: '孟浩然',
          summary: '探讨孟浩然《春晓》中展现的自然观察力和生活情趣...',
          readTime: '8分钟',
          difficulty: '初级'
        },
        {
          id: 3,
          title: '苏轼《水调歌头》的哲学思考',
          poemTitle: '水调歌头·明月几时有',
          poetName: '苏轼',
          summary: '解读苏轼词作中的人生哲理和宇宙观，感受豪放词风的魅力...',
          readTime: '12分钟',
          difficulty: '中级'
        }
      ]
    }
  }
}
</script>

<style scoped>
.appreciation-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.poetry-nav {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(210, 180, 140, 0.3);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 15px;
}

.brand-link {
  text-decoration: none;
}

.brand-title {
  font-size: 2.2rem;
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  font-weight: bold;
  margin: 0;
}

.brand-subtitle {
  font-size: 1rem;
  color: #666;
  font-family: '宋体', 'SimSun', serif;
  font-style: italic;
}

.nav-menu {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 30px;
}

.nav-link {
  text-decoration: none;
  color: #666;
  font-family: '楷体', 'STKaiti', serif;
  font-size: 1.1rem;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.nav-link:hover,
.router-link-active {
  color: #8B4513;
  background: rgba(210, 180, 140, 0.2);
}

.appreciation-main {
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.article-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
}

.article-image {
  height: 200px;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  color: white;
  font-size: 4rem;
  font-family: '楷体', 'STKaiti', serif;
}

.article-content {
  padding: 30px;
}

.article-title {
  font-size: 1.4rem;
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  margin-bottom: 10px;
}

.article-poem {
  color: #666;
  font-style: italic;
  margin-bottom: 15px;
}

.article-summary {
  color: #333;
  line-height: 1.6;
  margin-bottom: 20px;
}

.article-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.meta-item {
  background: rgba(210, 180, 140, 0.2);
  color: #8B4513;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.9rem;
}

.read-article {
  color: #8B4513;
  text-decoration: none;
  font-weight: bold;
}

@media (max-width: 768px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }
}
</style>