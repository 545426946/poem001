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
        <!-- 页面标题和搜索 -->
        <div class="page-header">
          <h2 class="page-title">诗词深度赏析</h2>
          <p class="page-subtitle">探索诗词背后的文化内涵和艺术价值</p>
          
          <div class="search-filters">
            <div class="search-box">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="搜索赏析文章..." 
                class="search-input"
              >
              <span class="search-icon">🔍</span>
            </div>
            
            <div class="filter-group">
              <select v-model="selectedCategory" class="filter-select">
                <option value="">所有分类</option>
                <option value="唐诗">唐诗赏析</option>
                <option value="宋词">宋词赏析</option>
                <option value="元曲">元曲赏析</option>
                <option value="现代诗">现代诗赏析</option>
              </select>
              
              <select v-model="selectedDifficulty" class="filter-select">
                <option value="">所有难度</option>
                <option value="初级">初级</option>
                <option value="中级">中级</option>
                <option value="高级">高级</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>正在加载赏析文章...</p>
        </div>

        <!-- 赏析文章列表 -->
        <div v-else class="articles-section">
          <div v-if="filteredArticles.length === 0" class="empty-state">
            <div class="empty-icon">📚</div>
            <h3>暂无相关赏析文章</h3>
            <p>尝试调整搜索条件或查看其他分类</p>
          </div>

          <div v-else class="articles-grid">
            <article class="article-card" v-for="article in filteredArticles" :key="article.id">
              <div class="article-image">
                <div class="image-placeholder">{{ article.poemTitle.charAt(0) }}</div>
                <div class="article-category">{{ article.category }}</div>
              </div>
              <div class="article-content">
                <h3 class="article-title">{{ article.title }}</h3>
                <p class="article-poem">《{{ article.poemTitle }}》 - {{ article.poetName }}</p>
                <p class="article-summary">{{ article.summary }}</p>
                
                <div class="article-tags">
                  <span class="tag" :class="`difficulty-${article.difficulty}`">{{ article.difficulty }}</span>
                  <span class="tag">{{ article.category }}</span>
                  <span class="tag">{{ article.readTime }}</span>
                </div>
                
                <div class="article-features">
                  <span class="feature">
                    <span class="feature-icon">📖</span>
                    {{ article.features.analysis ? '深度分析' : '基础解读' }}
                  </span>
                  <span class="feature">
                    <span class="feature-icon">🎨</span>
                    {{ article.features.artistic ? '艺术特色' : '文学价值' }}
                  </span>
                  <span class="feature">
                    <span class="feature-icon">📚</span>
                    {{ article.features.historical ? '历史背景' : '文化内涵' }}
                  </span>
                </div>
                
                <div class="article-actions">
                  <router-link :to="`/poetry/${article.id}`" class="btn-primary">阅读全文</router-link>
                  <button class="btn-outline" @click="toggleFavorite(article.id)">
                    {{ article.isFavorite ? '取消收藏' : '收藏文章' }}
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>

        <!-- 分页控件 -->
        <div v-if="filteredArticles.length > 0" class="pagination">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1" 
            class="pagination-btn"
          >
            上一页
          </button>
          <span class="pagination-info">第 {{ currentPage }} 页 / 共 {{ totalPages }} 页</span>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages" 
            class="pagination-btn"
          >
            下一页
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import mcpService from '../services/mcpService.js'

export default {
  name: 'Appreciation',
  data() {
    return {
      articles: [],
      loading: true,
      searchQuery: '',
      selectedCategory: '',
      selectedDifficulty: '',
      currentPage: 1,
      articlesPerPage: 6,
      favoriteArticles: new Set()
    }
  },
  computed: {
    filteredArticles() {
      let filtered = this.articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                             article.poemTitle.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                             article.poetName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                             article.summary.toLowerCase().includes(this.searchQuery.toLowerCase())
        
        const matchesCategory = !this.selectedCategory || article.category === this.selectedCategory
        const matchesDifficulty = !this.selectedDifficulty || article.difficulty === this.selectedDifficulty
        
        return matchesSearch && matchesCategory && matchesDifficulty
      })
      
      // 分页处理
      const startIndex = (this.currentPage - 1) * this.articlesPerPage
      return filtered.slice(startIndex, startIndex + this.articlesPerPage)
    },
    totalPages() {
      const totalArticles = this.articles.filter(article => {
        const matchesSearch = article.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                             article.poemTitle.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                             article.poetName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                             article.summary.toLowerCase().includes(this.searchQuery.toLowerCase())
        
        const matchesCategory = !this.selectedCategory || article.category === this.selectedCategory
        const matchesDifficulty = !this.selectedDifficulty || article.difficulty === this.selectedDifficulty
        
        return matchesSearch && matchesCategory && matchesDifficulty
      }).length
      
      return Math.ceil(totalArticles / this.articlesPerPage)
    }
  },
  watch: {
    searchQuery() {
      this.currentPage = 1
    },
    selectedCategory() {
      this.currentPage = 1
    },
    selectedDifficulty() {
      this.currentPage = 1
    }
  },
  async mounted() {
    // 延迟加载以确保MCP初始化完成
    setTimeout(() => {
      this.loadArticles()
    }, 500)
  },
  methods: {
    async loadArticles() {
      try {
        this.loading = true
        
        // 初始化MCP服务
        await mcpService.initialize()
        const poemsData = await mcpService.getPoems()
        
        // 如果获取到数据，使用真实数据
        if (poemsData && poemsData.length > 0) {
          this.articles = poemsData.slice(0, 12).map((poem, index) => {
            const categories = ['唐诗', '宋词', '元曲', '现代诗']
            const difficulties = ['初级', '中级', '高级']
            const features = [
              { analysis: true, artistic: true, historical: false },
              { analysis: false, artistic: true, historical: true },
              { analysis: true, artistic: false, historical: true },
              { analysis: true, artistic: true, historical: true }
            ]
            
            const category = categories[index % categories.length]
            const difficulty = difficulties[index % difficulties.length]
            const featureSet = features[index % features.length]
            
            const summaries = {
              唐诗: `深入解析${poem.author}的《${poem.title}》在唐代诗歌发展中的重要地位，分析其格律特点和意象运用。`,
              宋词: `探讨${poem.author}的《${poem.title}》在宋词创作中的艺术成就，解读词牌格律和情感表达。`,
              元曲: `分析${poem.author}的《${poem.title}》在元曲发展中的独特价值，研究其音乐性和戏剧性特征。`,
              现代诗: `解读${poem.author}的《${poem.title}》在现代诗歌创作中的创新意义，探讨其语言实验和思想深度。`
            }
            
            return {
              id: poem.id || index + 1,
              title: `《${poem.title}》的${category}赏析`,
              poemTitle: poem.title,
              poetName: poem.author,
              category: category,
              difficulty: difficulty,
              summary: summaries[category] || `深入分析${poem.author}的《${poem.title}》的艺术特色和文学价值...`,
              readTime: `${Math.max(5, Math.floor((poem.content?.length || 0) / 30))}分钟`,
              features: featureSet,
              isFavorite: this.favoriteArticles.has(poem.id || index + 1)
            }
          })
        } else {
          // 如果没有数据，使用回退数据
          this.articles = this.getFallbackArticles()
        }
      } catch (error) {
        console.error('加载赏析文章失败:', error)
        this.articles = this.getFallbackArticles()
      } finally {
        this.loading = false
      }
    },
    
    getFallbackArticles() {
      return [
        {
          id: 1,
          title: '《静夜思》的唐诗赏析',
          poemTitle: '静夜思',
          poetName: '李白',
          category: '唐诗',
          difficulty: '初级',
          summary: '深入解析李白《静夜思》在唐代诗歌发展中的重要地位，分析其格律特点和意象运用。',
          readTime: '8分钟',
          features: { analysis: true, artistic: true, historical: false },
          isFavorite: false
        },
        {
          id: 2,
          title: '《水调歌头》的宋词赏析',
          poemTitle: '水调歌头',
          poetName: '苏轼',
          category: '宋词',
          difficulty: '中级',
          summary: '探讨苏轼《水调歌头》在宋词创作中的艺术成就，解读词牌格律和情感表达。',
          readTime: '12分钟',
          features: { analysis: false, artistic: true, historical: true },
          isFavorite: false
        },
        {
          id: 3,
          title: '《天净沙·秋思》的元曲赏析',
          poemTitle: '天净沙·秋思',
          poetName: '马致远',
          category: '元曲',
          difficulty: '高级',
          summary: '分析马致远《天净沙·秋思》在元曲发展中的独特价值，研究其音乐性和戏剧性特征。',
          readTime: '15分钟',
          features: { analysis: true, artistic: false, historical: true },
          isFavorite: false
        }
      ]
    },
    
    toggleFavorite(articleId) {
      if (this.favoriteArticles.has(articleId)) {
        this.favoriteArticles.delete(articleId)
      } else {
        this.favoriteArticles.add(articleId)
      }
      
      // 更新文章收藏状态
      const article = this.articles.find(a => a.id === articleId)
      if (article) {
        article.isFavorite = this.favoriteArticles.has(articleId)
      }
    },
    
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
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

/* 页面标题和搜索区域 */
.page-header {
  text-align: center;
  margin-bottom: 50px;
}

.page-title {
  font-size: 2.8rem;
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.page-subtitle {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 30px;
}

.search-filters {
  display: flex;
  gap: 20px;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  max-width: 800px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 12px 45px 12px 20px;
  border: 2px solid #D2B48C;
  border-radius: 25px;
  font-size: 1rem;
  font-family: '楷体', 'STKaiti', serif;
  background: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #8B4513;
  box-shadow: 0 0 10px rgba(139, 69, 19, 0.2);
}

.search-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
}

.filter-group {
  display: flex;
  gap: 15px;
}

.filter-select {
  padding: 12px 20px;
  border: 2px solid #D2B48C;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.9);
  font-family: '楷体', 'STKaiti', serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #8B4513;
}

/* 加载状态 */
.loading-container {
  text-align: center;
  padding: 60px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #8B4513;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 0;
  color: #666;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #8B4513;
}

/* 文章网格 */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.article-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.article-image {
  height: 200px;
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.image-placeholder {
  color: white;
  font-size: 4rem;
  font-family: '楷体', 'STKaiti', serif;
}

.article-category {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.9);
  color: #8B4513;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: bold;
}

.article-content {
  padding: 30px;
}

.article-title {
  font-size: 1.4rem;
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  margin-bottom: 10px;
  line-height: 1.3;
}

.article-poem {
  color: #666;
  font-style: italic;
  margin-bottom: 15px;
  font-size: 0.95rem;
}

.article-summary {
  color: #333;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 0.9rem;
}

/* 标签样式 */
.article-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
}

.tag.difficulty-初级 {
  background: #e8f5e8;
  color: #2e7d32;
}

.tag.difficulty-中级 {
  background: #fff3e0;
  color: #f57c00;
}

.tag.difficulty-高级 {
  background: #ffebee;
  color: #c62828;
}

.tag:not(.difficulty-初级):not(.difficulty-中级):not(.difficulty-高级) {
  background: rgba(210, 180, 140, 0.2);
  color: #8B4513;
}

/* 特性标签 */
.article-features {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.feature {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
  color: #666;
}

.feature-icon {
  font-size: 1rem;
}

/* 按钮样式 */
.article-actions {
  display: flex;
  gap: 10px;
}

.btn-primary {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  color: white;
  padding: 8px 20px;
  border: none;
  border-radius: 20px;
  text-decoration: none;
  font-family: '楷体', 'STKaiti', serif;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  flex: 1;
  text-align: center;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(139, 69, 19, 0.3);
}

.btn-outline {
  background: transparent;
  color: #8B4513;
  padding: 8px 20px;
  border: 2px solid #8B4513;
  border-radius: 20px;
  font-family: '楷体', 'STKaiti', serif;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  flex: 1;
}

.btn-outline:hover {
  background: #8B4513;
  color: white;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}

.pagination-btn {
  padding: 10px 20px;
  border: 2px solid #8B4513;
  background: white;
  color: #8B4513;
  border-radius: 20px;
  font-family: '楷体', 'STKaiti', serif;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: #8B4513;
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  color: #666;
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .page-title {
    font-size: 2.2rem;
  }
  
  .search-filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .filter-group {
    justify-content: center;
  }
  
  .articles-grid {
    grid-template-columns: 1fr;
  }
  
  .article-actions {
    flex-direction: column;
  }
  
  .pagination {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 15px 20px;
    gap: 15px;
  }
  
  .nav-menu {
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .article-content {
    padding: 20px;
  }
}
</style>