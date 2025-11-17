<template>
  <div class="about-container">
    <!-- 导航栏 -->
    <nav class="poetry-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <router-link to="/" class="brand-link">
            <h1 class="brand-title">古韵诗香</h1>
          </router-link>
          <span class="brand-subtitle">关于我们</span>
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
    <main class="about-main">
      <div class="container">
        <!-- 关于我们 -->
        <section class="about-section">
          <h2 class="section-title">关于古韵诗香</h2>
          <div class="about-content">
            <p>古韵诗香是一个致力于传承和推广中华优秀传统文化的诗词赏析平台。我们希望通过现代技术手段，让更多人了解和欣赏中国古典诗词的魅力。</p>
            
            <h3>平台特色</h3>
            <ul>
              <li>丰富的诗词库，涵盖各个朝代经典作品</li>
              <li>专业的诗词赏析和解读</li>
              <li>诗人传记和创作背景介绍</li>
              <li>智能搜索和分类浏览功能</li>
              <li>响应式设计，支持多设备访问</li>
            </ul>
            
            <h3>我们的使命</h3>
            <p>让古典诗词在现代社会中焕发新的生命力，为诗词爱好者提供一个交流学习的平台。</p>
          </div>
        </section>

        <!-- 联系方式 -->
        <section class="contact-section">
          <h2 class="section-title">联系我们</h2>
          <div class="contact-info">
            <p>如果您有任何建议或问题，欢迎通过以下方式联系我们：</p>
            <div class="contact-methods">
              <div class="contact-method">
                <span class="method-icon">📧</span>
                <span>邮箱: contact@guyunshixiang.com</span>
              </div>
              <div class="contact-method">
                <span class="method-icon">🌐</span>
                <span>网站: www.guyunshixiang.com</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'About'
}
</script>

<style scoped>
.about-container {
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

.about-main {
  padding: 40px 0;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.about-section,
.contact-section {
  background: white;
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.section-title {
  font-size: 2rem;
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  margin-bottom: 20px;
  text-align: center;
}

.about-content {
  line-height: 1.8;
  color: #333;
}

.about-content h3 {
  color: #8B4513;
  margin: 20px 0 10px;
  font-family: '楷体', 'STKaiti', serif;
}

.about-content ul {
  margin: 15px 0;
  padding-left: 20px;
}

.about-content li {
  margin-bottom: 8px;
}

.contact-info {
  text-align: center;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  margin-top: 20px;
}

.contact-method {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
}

.method-icon {
  font-size: 1.5rem;
}

@media (max-width: 768px) {
  .about-section,
  .contact-section {
    padding: 30px 20px;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}
</style>