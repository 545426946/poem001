<template>
  <div class="poetry-container">
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
          <li><a href="#tangshi" :class="{ active: activeSection === 'tangshi' }" @click="setActiveSection('tangshi')">唐诗</a></li>
          <li><a href="#songci" :class="{ active: activeSection === 'songci' }" @click="setActiveSection('songci')">宋词</a></li>
          <li><a href="#gushi" :class="{ active: activeSection === 'gushi' }" @click="setActiveSection('gushi')">古诗</a></li>
          <li><a href="#about" :class="{ active: activeSection === 'about' }" @click="setActiveSection('about')">关于</a></li>
          <li><router-link to="/login" class="login-link">登录/注册</router-link></li>
        </ul>
      </div>
    </nav>

    <!-- 主布局 -->
    <div class="main-layout">
      <!-- 侧边栏 -->
      <aside class="sidebar">
        <div class="sidebar-content">
          <div class="sidebar-section">
            <h3>诗词分类</h3>
            <ul class="category-list">
              <li v-for="category in categories" :key="category.id" 
                  :class="{ active: activeCategory === category.id }"
                  @click="setActiveCategory(category.id)">
                {{ category.name }} <span class="count">({{ category.count }})</span>
              </li>
            </ul>
          </div>
          
          <div class="sidebar-section">
            <h3>热门诗人</h3>
            <ul class="poet-list">
              <li v-for="poet in topPoets" :key="poet.name">
                <span class="poet-name">{{ poet.name }}</span>
                <span class="poet-count">{{ poet.count }}首</span>
              </li>
            </ul>
          </div>

          <div class="sidebar-section">
            <h3>今日推荐</h3>
            <div class="recommendation">
              <div class="rec-poem">
                <div class="rec-title">{{ todayRecommendation.title }}</div>
                <div class="rec-author">{{ todayRecommendation.author }}</div>
                <div class="rec-preview">{{ todayRecommendation.preview }}</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- 主内容区域 -->
      <main class="poetry-main">
        <div class="poetry-content">
          <!-- 搜索框 -->
          <div class="search-section">
            <div class="search-container">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="搜索诗词、作者或关键词..." 
                class="search-input"
              />
              <button class="search-btn">搜索</button>
            </div>
          </div>

          <!-- 诗词展示区 -->
          <section class="poetry-section" v-for="category in filteredCategories" :key="category.id">
            <h2 class="section-title">{{ category.name }}</h2>
            <div class="poetry-grid">
              <div class="poetry-card" v-for="poem in getPoemsByCategory(category.id)" :key="poem.id">
                <div class="poetry-header">
                  <div class="poetry-title">{{ poem.title }}</div>
                  <div class="poetry-author">【{{ poem.dynasty }}】{{ poem.author }}</div>
                </div>
                <div class="poetry-content">
                  <p v-for="(line, index) in poem.content" :key="index" class="poetry-line">
                    {{ line }}
                  </p>
                </div>
                <div class="poetry-appreciation">
                  <h3>赏析</h3>
                  <p>{{ poem.appreciation }}</p>
                </div>
                <div class="poetry-tags">
                  <span v-for="tag in poem.tags" :key="tag" class="tag">{{ tag }}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import mcpService from '../services/mcpService.js'

export default {
  name: 'PoetryView',
  data() {
    return {
      activeSection: 'tangshi',
      activeCategory: 'all',
      searchQuery: '',
      categories: [
        { id: 'all', name: '全部诗词', count: 0 },
        { id: 'love', name: '爱情诗词', count: 0 },
        { id: 'landscape', name: '山水田园', count: 0 },
        { id: 'farewell', name: '送别思念', count: 0 },
        { id: 'patriotic', name: '爱国忧民', count: 0 }
      ],
      topPoets: [],
      todayRecommendation: {
        title: '',
        author: '',
        preview: ''
      },
      poems: [],
      loading: true
    }
  },
  async mounted() {
    await this.loadPoems()
  },
  computed: {
    filteredCategories() {
      return this.categories.filter(cat => 
        this.activeCategory === 'all' || cat.id === this.activeCategory
      )
    }
  },
  methods: {
    async loadPoems() {
      try {
        this.loading = true
        const poemsData = await mcpService.getPoems()
        this.poems = poemsData.map(poem => ({
          id: poem.id,
          title: poem.title,
          author: poem.author,
          dynasty: poem.dynasty,
          category: poem.category,
          tags: poem.tags || [],
          content: poem.content ? poem.content.split('\n').filter(line => line.trim()) : [],
          appreciation: poem.appreciation || ''
        }))
        
        // 更新分类计数
        this.updateCategoryCounts()
        // 更新热门诗人
        this.updateTopPoets()
        // 设置今日推荐
        this.setTodayRecommendation()
      } catch (error) {
        console.error('加载诗词数据失败:', error)
        this.poems = []
      } finally {
        this.loading = false
      }
    },
    updateCategoryCounts() {
      this.categories.forEach(category => {
        if (category.id === 'all') {
          category.count = this.poems.length
        } else {
          category.count = this.poems.filter(poem => poem.category === category.id).length
        }
      })
    },
    updateTopPoets() {
      const poetCounts = {}
      this.poems.forEach(poem => {
        poetCounts[poem.author] = (poetCounts[poem.author] || 0) + 1
      })
      
      this.topPoets = Object.entries(poetCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)
    },
    setTodayRecommendation() {
      if (this.poems.length > 0) {
        const randomPoem = this.poems[Math.floor(Math.random() * this.poems.length)]
        this.todayRecommendation = {
          title: randomPoem.title,
          author: randomPoem.author,
          preview: randomPoem.content.slice(0, 2).join(' ')
        }
      }
    },
    setActiveSection(section) {
      this.activeSection = section
    },
    setActiveCategory(categoryId) {
      this.activeCategory = categoryId
    },
    getPoemsByCategory(categoryId) {
      if (categoryId === 'all') {
        return this.poems
      }
      return this.poems.filter(poem => poem.category === categoryId)
    }
  }
}
</script>

<style scoped>
.poetry-container {
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
  max-width: 1400px;
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

.nav-menu a {
  text-decoration: none;
  color: #666;
  font-family: '楷体', 'STKaiti', serif;
  font-size: 1.1rem;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-menu a:hover,
.nav-menu a.active {
  color: #8B4513;
  background: rgba(210, 180, 140, 0.2);
}

.nav-menu a.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 2px;
  background: #8B4513;
}

.login-link {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  color: white !important;
  border-radius: 20px;
  padding: 8px 16px;
  transition: all 0.3s ease;
}

.login-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(139, 69, 19, 0.3);
}

/* 主布局 */
.main-layout {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
  min-height: calc(100vh - 70px);
}

/* 侧边栏样式 */
.sidebar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: fit-content;
  position: sticky;
  top: 100px;
}

.sidebar-section {
  margin-bottom: 30px;
}

.sidebar-section h3 {
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  font-size: 1.3rem;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(210, 180, 140, 0.3);
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.category-list li {
  padding: 12px 15px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: '宋体', 'SimSun', serif;
  color: #666;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-list li:hover,
.category-list li.active {
  background: rgba(210, 180, 140, 0.2);
  color: #8B4513;
}

.category-list .count {
  font-size: 0.9rem;
  opacity: 0.7;
}

.poet-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.poet-list li {
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(210, 180, 140, 0.2);
  font-family: '宋体', 'SimSun', serif;
  color: #666;
}

.poet-list li:last-child {
  border-bottom: none;
}

.poet-name {
  font-weight: bold;
}

.poet-count {
  font-size: 0.9rem;
  opacity: 0.7;
}

.recommendation {
  background: rgba(210, 180, 140, 0.1);
  padding: 15px;
  border-radius: 10px;
  border-left: 4px solid #D2B48C;
}

.rec-poem .rec-title {
  font-family: '楷体', 'STKaiti', serif;
  font-size: 1.1rem;
  color: #8B4513;
  font-weight: bold;
  margin-bottom: 5px;
}

.rec-poem .rec-author {
  font-family: '宋体', 'SimSun', serif;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.rec-poem .rec-preview {
  font-family: '楷体', 'STKaiti', serif;
  font-size: 0.9rem;
  color: #888;
  line-height: 1.4;
}

/* 主内容区域 */
.poetry-main {
  min-height: 600px;
}

.search-section {
  margin-bottom: 30px;
}

.search-container {
  display: flex;
  gap: 10px;
  max-width: 500px;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid rgba(210, 180, 140, 0.3);
  border-radius: 25px;
  font-family: '宋体', 'SimSun', serif;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #D2B48C;
  box-shadow: 0 0 10px rgba(210, 180, 140, 0.3);
}

.search-btn {
  padding: 12px 25px;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-family: '楷体', 'STKaiti', serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(139, 69, 19, 0.3);
}

/* 诗词展示区 */
.poetry-section {
  margin-bottom: 40px;
}

.section-title {
  font-size: 2rem;
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  margin-bottom: 25px;
  text-align: center;
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #D2B48C;
}

.poetry-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 25px;
}

.poetry-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.poetry-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.poetry-header {
  text-align: center;
  margin-bottom: 20px;
}

.poetry-title {
  font-size: 1.6rem;
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  font-weight: bold;
  margin-bottom: 8px;
}

.poetry-author {
  font-size: 1rem;
  color: #666;
  font-family: '宋体', 'SimSun', serif;
  font-style: italic;
}

.poetry-content {
  margin-bottom: 20px;
}

.poetry-line {
  font-size: 1.2rem;
  color: #333;
  font-family: '楷体', 'STKaiti', serif;
  line-height: 1.8;
  text-align: center;
  margin: 8px 0;
}

.poetry-appreciation {
  background: rgba(210, 180, 140, 0.1);
  padding: 18px;
  border-radius: 10px;
  border-left: 4px solid #D2B48C;
  margin-bottom: 15px;
}

.poetry-appreciation h3 {
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.poetry-appreciation p {
  color: #666;
  font-family: '宋体', 'SimSun', serif;
  line-height: 1.6;
  font-size: 0.95rem;
  text-align: justify;
}

.poetry-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background: rgba(210, 180, 140, 0.2);
  color: #8B4513;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-family: '宋体', 'SimSun', serif;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .sidebar {
    position: static;
    order: 2;
  }
  
  .poetry-main {
    order: 1;
  }
  
  .poetry-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 15px 20px;
    gap: 15px;
  }
  
  .nav-menu {
    gap: 15px;
  }
  
  .nav-menu a {
    font-size: 1rem;
    padding: 6px 12px;
  }
  
  .brand-title {
    font-size: 1.8rem;
  }
  
  .main-layout {
    padding: 20px 15px;
  }
  
  .search-container {
    flex-direction: column;
  }
  
  .poetry-card {
    padding: 20px;
  }
  
  .section-title {
    font-size: 1.6rem;
  }
  
  .poetry-title {
    font-size: 1.4rem;
  }
  
  .poetry-line {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .poetry-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
  }
  
  .sidebar {
    padding: 20px;
  }
}
</style>