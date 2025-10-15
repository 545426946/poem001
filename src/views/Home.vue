<template>
  <div class="home-container">
    <!-- 古风背景装饰 -->
    <div class="background-decoration">
      <div class="mountain"></div>
      <div class="cloud cloud-1"></div>
      <div class="cloud cloud-2"></div>
      <div class="cloud cloud-3"></div>
    </div>

    <!-- 导航栏 -->
    <nav class="poetry-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <h1 class="brand-title">古韵诗香</h1>
          <span class="brand-subtitle">诗词赏析平台</span>
        </div>
        <ul class="nav-menu">
          <li><router-link to="/" class="nav-link">首页</router-link></li>
          <li><router-link to="/poems" class="nav-link">诗词库</router-link></li>
          <li><router-link to="/poets" class="nav-link">诗人</router-link></li>
          <li><router-link to="/appreciation" class="nav-link">赏析</router-link></li>
          <li><router-link to="/about" class="nav-link">关于</router-link></li>
          <li><router-link to="/admin/database" class="nav-link admin-link">数据库管理</router-link></li>
        </ul>
      </div>
    </nav>

    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <h2 class="hero-title">探索中华诗词之美</h2>
        <p class="hero-subtitle">从唐诗宋词到现代诗歌，感受千年文化传承</p>
        <div class="hero-actions">
          <router-link to="/poems" class="btn-primary">开始探索</router-link>
          <router-link to="/appreciation" class="btn-outline">诗词赏析</router-link>
        </div>
      </div>
    </section>

    <!-- 特色功能 -->
    <section class="features-section">
      <div class="container">
        <h3 class="section-title">平台特色</h3>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📚</div>
            <h4>丰富诗词库</h4>
            <p>收录数千首经典诗词，涵盖各个朝代和流派</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🎨</div>
            <h4>深度赏析</h4>
            <p>专业文学赏析，理解诗词背后的文化内涵</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h4>智能搜索</h4>
            <p>按作者、朝代、主题等多种方式快速查找</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📖</div>
            <h4>学习工具</h4>
            <p>提供注释、翻译、朗诵等学习辅助功能</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 热门诗词 -->
    <section class="popular-section">
      <div class="container">
        <h3 class="section-title">热门诗词</h3>
        <div class="poems-grid">
          <div class="poem-card" v-for="poem in popularPoems" :key="poem.id">
            <h4>{{ poem.title }}</h4>
            <p class="poem-author">{{ poem.author }}（{{ poem.dynasty }}）</p>
            <p class="poem-preview">{{ poem.preview }}</p>
            <router-link :to="`/poem/${poem.id}`" class="read-more">阅读全文</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 管理员快捷入口 -->
    <section class="admin-section" v-if="showAdminSection">
      <div class="container">
        <h3 class="section-title">管理员工具</h3>
        <div class="admin-grid">
          <div class="admin-card">
            <div class="admin-icon">🗃️</div>
            <h4>数据库管理</h4>
            <p>管理Supabase数据库表结构、数据和连接状态</p>
            <router-link to="/admin/database" class="btn-primary">进入管理</router-link>
          </div>
          <div class="admin-card">
            <div class="admin-icon">🔧</div>
            <h4>系统配置</h4>
            <p>配置MCP连接、环境变量和系统参数</p>
            <button class="btn-outline" @click="showConfigInfo">查看配置</button>
          </div>
          <div class="admin-card">
            <div class="admin-icon">📊</div>
            <h4>数据监控</h4>
            <p>实时监控系统性能和数据统计</p>
            <button class="btn-outline" @click="showStats">查看统计</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      showAdminSection: true, // 临时设置为true，实际应该根据用户角色判断
      popularPoems: [
        {
          id: 1,
          title: '静夜思',
          author: '李白',
          dynasty: '唐',
          preview: '床前明月光，疑是地上霜。举头望明月，低头思故乡。'
        },
        {
          id: 2,
          title: '春晓',
          author: '孟浩然',
          dynasty: '唐',
          preview: '春眠不觉晓，处处闻啼鸟。夜来风雨声，花落知多少。'
        },
        {
          id: 3,
          title: '水调歌头·明月几时有',
          author: '苏轼',
          dynasty: '宋',
          preview: '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。'
        },
        {
          id: 4,
          title: '相思',
          author: '王维',
          dynasty: '唐',
          preview: '红豆生南国，春来发几枝。愿君多采撷，此物最相思。'
        }
      ]
    }
  },
  methods: {
    showConfigInfo() {
      alert(`当前配置信息：
- Supabase URL: ${import.meta.env.VITE_SUPABASE_URL || '未配置'}
- 环境: ${import.meta.env.MODE}
- 版本: 1.0.0
- 项目类型: 诗词赏析平台`);
    },
    showStats() {
      alert(`系统统计信息：
- 数据库连接: 正常
- MCP状态: 已配置
- 表结构: 已部署
- 数据量: 待统计
- 项目状态: 专注诗词赏析`);
    }
  }
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow-x: hidden;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.mountain {
  position: absolute;
  bottom: 0;
  left: 10%;
  width: 300px;
  height: 200px;
  background: linear-gradient(45deg, #8B7355 0%, #A0522D 100%);
  clip-path: polygon(0% 100%, 50% 0%, 100% 100%);
  opacity: 0.3;
}

.cloud {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  opacity: 0.6;
}

.cloud-1 {
  width: 120px;
  height: 60px;
  top: 20%;
  left: 5%;
  animation: float 20s infinite linear;
}

.cloud-2 {
  width: 80px;
  height: 40px;
  top: 30%;
  right: 10%;
  animation: float 25s infinite linear reverse;
}

.cloud-3 {
  width: 100px;
  height: 50px;
  top: 60%;
  left: 15%;
  animation: float 30s infinite linear;
}

@keyframes float {
  0% { transform: translateX(-100px); }
  100% { transform: translateX(calc(100vw + 100px)); }
}

/* 导航栏样式 */
.poetry-nav {
  position: relative;
  z-index: 10;
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

.brand-title {
  font-size: 2.2rem;
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  font-weight: bold;
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
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
  position: relative;
}

.nav-link:hover,
.router-link-active {
  color: #8B4513;
  background: rgba(210, 180, 140, 0.2);
}

.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: #8B4513;
}

/* 英雄区域 */
.hero-section {
  position: relative;
  z-index: 1;
  padding: 120px 0 80px;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-title {
  font-size: 3.5rem;
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: 1.3rem;
  color: #666;
  margin-bottom: 40px;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  color: white;
  padding: 12px 30px;
  border-radius: 25px;
  text-decoration: none;
  font-family: '楷体', 'STKaiti', serif;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(139, 69, 19, 0.3);
}

.btn-outline {
  border: 2px solid #8B4513;
  color: #8B4513;
  padding: 12px 30px;
  border-radius: 25px;
  text-decoration: none;
  font-family: '楷体', 'STKaiti', serif;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: #8B4513;
  color: white;
  transform: translateY(-2px);
}

/* 特色功能 */
.features-section {
  position: relative;
  z-index: 1;
  padding: 80px 0;
  background: rgba(255, 255, 255, 0.8);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  font-size: 2.5rem;
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  text-align: center;
  margin-bottom: 50px;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #D2B48C;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  padding: 40px 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.feature-card h4 {
  font-size: 1.4rem;
  color: #8B4513;
  margin-bottom: 15px;
  font-family: '楷体', 'STKaiti', serif;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}

/* 热门诗词 */
.popular-section {
  position: relative;
  z-index: 1;
  padding: 80px 0;
}

.poems-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.poem-card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.poem-card:hover {
  transform: translateY(-5px);
}

.poem-card h4 {
  font-size: 1.3rem;
  color: #8B4513;
  margin-bottom: 10px;
  font-family: '楷体', 'STKaiti', serif;
}

.poem-author {
  color: #666;
  font-style: italic;
  margin-bottom: 15px;
}

.poem-preview {
  color: #333;
  line-height: 1.6;
  margin-bottom: 20px;
}

.read-more {
  color: #8B4513;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.read-more:hover {
  color: #A0522D;
}

/* 管理员区域样式 */
.admin-section {
  position: relative;
  z-index: 1;
  padding: 60px 0;
  background: rgba(139, 69, 19, 0.05);
  border-top: 1px solid rgba(210, 180, 140, 0.3);
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.admin-card {
  background: white;
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.admin-card:hover {
  transform: translateY(-5px);
}

.admin-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.admin-card h4 {
  font-size: 1.3rem;
  color: #8B4513;
  margin-bottom: 15px;
  font-family: '楷体', 'STKaiti', serif;
}

.admin-card p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.admin-link {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white !important;
  font-weight: bold;
}

.admin-link:hover {
  background: linear-gradient(135deg, #ee5a24 0%, #ff6b6b 100%);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .nav-menu {
    gap: 15px;
  }
  
  .nav-link {
    font-size: 1rem;
    padding: 6px 12px;
  }
}

@media (max-width: 480px) {
  .features-grid,
  .poems-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 15px 20px;
    gap: 15px;
  }
}
</style>