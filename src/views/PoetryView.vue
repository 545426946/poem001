<template>
  <div class="poetry-detail-container">
    <!-- 导航栏 -->
    <nav class="poetry-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <router-link to="/" class="brand-link">
            <h1 class="brand-title">古韵诗香</h1>
          </router-link>
          <span class="brand-subtitle">诗词详情</span>
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

    <!-- 诗词详情内容 -->
    <div class="poetry-detail-content" v-if="poem">
      <div class="poetry-header">
        <h1 class="poetry-title">{{ poem.title }}</h1>
        <div class="poetry-meta">
          <span class="poetry-author">作者：{{ poem.author }}</span>
          <span class="poetry-dynasty">朝代：{{ poem.dynasty }}</span>
          <span class="poetry-category">分类：{{ getCategoryName(poem.category) }}</span>
        </div>
      </div>

      <!-- 诗词内容 -->
      <div class="poetry-body">
        <div class="poetry-text">
          <div class="poetry-lines">
            <p v-for="(line, index) in poem.content" :key="index" class="poetry-line">
              {{ line }}
            </p>
          </div>
        </div>

        <!-- 翻译 -->
        <div class="poetry-translation" v-if="poem.translation">
          <h3 class="section-title">翻译</h3>
          <p class="translation-text">{{ poem.translation }}</p>
        </div>

        <!-- 注释 -->
        <div class="poetry-annotation" v-if="poem.annotation">
          <h3 class="section-title">注释</h3>
          <p class="annotation-text">{{ poem.annotation }}</p>
        </div>

        <!-- 赏析 -->
        <div class="poetry-appreciation" v-if="poem.appreciation">
          <h3 class="section-title">赏析</h3>
          <p class="appreciation-text">{{ poem.appreciation }}</p>
        </div>

        <!-- 标签 -->
        <div class="poetry-tags" v-if="poem.tags && poem.tags.length > 0">
          <h3 class="section-title">标签</h3>
          <div class="tags-container">
            <span v-for="tag in poem.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="poetry-actions">
        <button class="action-btn back-btn" @click="$router.back()">
          <span class="btn-icon">←</span>
          返回列表
        </button>
        <button class="action-btn favorite-btn">
          <span class="btn-icon">❤</span>
          收藏
        </button>
        <button class="action-btn share-btn">
          <span class="btn-icon">↗</span>
          分享
        </button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div class="loading-container" v-else-if="loading">
      <div class="loading-spinner"></div>
      <p>正在加载诗词详情...</p>
    </div>

    <!-- 错误状态 -->
    <div class="error-container" v-else>
      <h2>诗词未找到</h2>
      <p>抱歉，找不到ID为 {{ $route.params.id }} 的诗词</p>
      <router-link to="/poems" class="back-link">返回诗词库</router-link>
    </div>
  </div>
</template>

<script>
import mcpService from '../services/mcpService.js'

export default {
  name: 'PoetryView',
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      poem: null,
      loading: true,
      categoryMap: {
        'love': '爱情诗词',
        'landscape': '山水田园',
        'farewell': '送别思念',
        'patriotic': '爱国忧民',
        'philosophy': '哲理',
        'nostalgia': '思乡',
        'nature': '自然',
        'romantic': '浪漫'
      }
    }
  },
  async mounted() {
    await this.loadPoemDetail()
  },
  watch: {
    '$route.params.id': {
      handler(newId) {
        if (newId !== this.id) {
          this.loadPoemDetail()
        }
      },
      immediate: true
    }
  },
  methods: {
    async loadPoemDetail() {
      try {
        this.loading = true
        const poemsData = await mcpService.getPoems()
        
        // 查找指定ID的诗词
        const foundPoem = poemsData.find(poem => poem.id == this.id)
        
        if (foundPoem) {
          this.poem = {
            id: foundPoem.id,
            title: foundPoem.title,
            author: foundPoem.author,
            dynasty: foundPoem.dynasty,
            category: foundPoem.category,
            tags: foundPoem.tags || [],
            content: foundPoem.content ? foundPoem.content.split('\n').filter(line => line.trim()) : [],
            translation: foundPoem.translation || '',
            annotation: foundPoem.annotation || '',
            appreciation: foundPoem.appreciation || ''
          }
        } else {
          this.poem = null
        }
      } catch (error) {
        console.error('加载诗词详情失败:', error)
        this.poem = null
      } finally {
        this.loading = false
      }
    },
    
    getCategoryName(category) {
      return this.categoryMap[category] || category
    }
  }
}
</script>

<style scoped>
.poetry-detail-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  position: relative;
  overflow-x: hidden;
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

/* 诗词详情内容样式 */
.poetry-detail-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.poetry-header {
  text-align: center;
  margin-bottom: 40px;
}

.poetry-title {
  font-size: 2.5rem;
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  font-weight: bold;
  margin-bottom: 15px;
  line-height: 1.2;
}

.poetry-meta {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.poetry-author,
.poetry-dynasty,
.poetry-category {
  font-size: 1.1rem;
  color: #666;
  font-family: '宋体', 'SimSun', serif;
}

/* 诗词内容样式 */
.poetry-body {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.poetry-text {
  margin-bottom: 30px;
}

.poetry-lines {
  text-align: center;
}

.poetry-line {
  font-size: 1.4rem;
  color: #333;
  font-family: '楷体', 'STKaiti', serif;
  line-height: 2;
  margin: 10px 0;
}

.section-title {
  font-size: 1.5rem;
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  margin: 30px 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(210, 180, 140, 0.3);
}

.translation-text,
.annotation-text,
.appreciation-text {
  font-size: 1.1rem;
  color: #555;
  font-family: '宋体', 'SimSun', serif;
  line-height: 1.8;
  text-align: justify;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag {
  background: rgba(210, 180, 140, 0.2);
  color: #8B4513;
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-family: '宋体', 'SimSun', serif;
}

/* 操作按钮样式 */
.poetry-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 40px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  font-family: '楷体', 'STKaiti', serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-btn {
  background: #6c757d;
  color: white;
}

.favorite-btn {
  background: #dc3545;
  color: white;
}

.share-btn {
  background: #007bff;
  color: white;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.btn-icon {
  font-size: 1.2rem;
}

/* 加载状态样式 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid rgba(210, 180, 140, 0.3);
  border-left: 5px solid #8B4513;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  font-size: 1.2rem;
  color: #666;
  font-family: '宋体', 'SimSun', serif;
}

/* 错误状态样式 */
.error-container {
  text-align: center;
  padding: 60px 20px;
}

.error-container h2 {
  font-size: 2rem;
  color: #dc3545;
  font-family: '楷体', 'STKaiti', serif;
  margin-bottom: 15px;
}

.error-container p {
  font-size: 1.1rem;
  color: #666;
  font-family: '宋体', 'SimSun', serif;
  margin-bottom: 25px;
}

.back-link {
  color: #007bff;
  text-decoration: none;
  font-family: '楷体', 'STKaiti', serif;
  font-size: 1.1rem;
}

.back-link:hover {
  text-decoration: underline;
}

/* 响应式设计 */
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
  
  .poetry-detail-content {
    padding: 20px 15px;
  }
  
  .poetry-title {
    font-size: 2rem;
  }
  
  .poetry-body {
    padding: 25px;
  }
  
  .poetry-line {
    font-size: 1.2rem;
  }
  
  .poetry-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .action-btn {
    width: 200px;
  }
}

@media (max-width: 480px) {
  .poetry-meta {
    flex-direction: column;
    gap: 10px;
  }
  
  .poetry-title {
    font-size: 1.8rem;
  }
  
  .poetry-line {
    font-size: 1.1rem;
  }
}
</style>