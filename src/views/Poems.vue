<template>
  <div class="poems-container">
    <!-- 导航栏 -->
    <nav class="poetry-nav">
      <div class="nav-container">
        <div class="nav-brand">
          <router-link to="/" class="brand-link">
            <h1 class="brand-title">古韵诗香</h1>
          </router-link>
          <span class="brand-subtitle">诗词库</span>
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
    <main class="poems-main">
      <div class="container">
        <!-- 搜索和筛选 -->
        <div class="filters-section">
          <div class="search-box">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="搜索诗词、作者或关键词..." 
              class="search-input"
            />
            <button class="search-btn">搜索</button>
          </div>
          
          <div class="filter-options">
            <select v-model="selectedDynasty" class="filter-select">
              <option value="">全部朝代</option>
              <option value="唐">唐代</option>
              <option value="宋">宋代</option>
              <option value="元">元代</option>
              <option value="明">明代</option>
              <option value="清">清代</option>
            </select>
            
            <select v-model="selectedCategory" class="filter-select">
              <option value="">全部分类</option>
              <option value="love">爱情</option>
              <option value="landscape">山水</option>
              <option value="farewell">送别</option>
              <option value="patriotic">爱国</option>
              <option value="philosophy">哲理</option>
            </select>
          </div>
        </div>

        <!-- 诗词列表 -->
        <div class="poems-list">
          <div class="poem-item" v-for="poem in filteredPoems" :key="poem.id">
            <div class="poem-header">
              <h3 class="poem-title">{{ poem.title }}</h3>
              <div class="poem-meta">
                <span class="poem-author">{{ poem.author }}</span>
                <span class="poem-dynasty">（{{ poem.dynasty }}）</span>
              </div>
            </div>
            
            <div class="poem-content">
              <p v-for="(line, index) in poem.content" :key="index" class="poem-line">
                {{ line }}
              </p>
            </div>
            
            <div class="poem-footer">
              <div class="poem-tags">
                <span v-for="tag in poem.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <router-link :to="`/poetry/${poem.id}`" class="read-more">阅读全文</router-link>
            </div>
          </div>
        </div>

        <!-- 分页 -->
        <div class="pagination" v-if="totalPages > 1">
          <button 
            v-for="page in totalPages" 
            :key="page"
            :class="['page-btn', { active: currentPage === page }]"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import mcpService from '../services/mcpService.js'

export default {
  name: 'Poems',
  data() {
    return {
      searchQuery: '',
      selectedDynasty: '',
      selectedCategory: '',
      currentPage: 1,
      poemsPerPage: 10,
      poems: [],
      loading: true
    }
  },
  async mounted() {
    await this.loadPoems()
  },
  computed: {
    filteredPoems() {
      let filtered = this.poems;
      
      // 搜索过滤
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(poem => 
          poem.title.toLowerCase().includes(query) ||
          poem.author.toLowerCase().includes(query) ||
          poem.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      // 朝代过滤
      if (this.selectedDynasty) {
        filtered = filtered.filter(poem => poem.dynasty === this.selectedDynasty);
      }
      
      // 分类过滤
      if (this.selectedCategory) {
        filtered = filtered.filter(poem => poem.category === this.selectedCategory);
      }
      
      return filtered;
    },
    totalPages() {
      return Math.ceil(this.filteredPoems.length / this.poemsPerPage);
    },
    paginatedPoems() {
      const start = (this.currentPage - 1) * this.poemsPerPage;
      const end = start + this.poemsPerPage;
      return this.filteredPoems.slice(start, end);
    }
  },
  methods: {
    async loadPoems() {
      try {
        this.loading = true
        const poemsData = await mcpService.getPoems()
        if (poemsData && poemsData.length > 0) {
          this.poems = poemsData.map(poem => ({
            id: poem.id,
            title: poem.title,
            author: poem.author,
            dynasty: poem.dynasty,
            category: poem.category,
            tags: poem.tags || [],
            content: poem.content ? poem.content.split('\n').filter(line => line.trim()) : []
          }))
        } else {
          // 使用回退数据
          this.poems = this.getFallbackPoems()
        }
      } catch (error) {
        console.error('加载诗词数据失败:', error)
        // 使用回退数据
        this.poems = this.getFallbackPoems()
      } finally {
        this.loading = false
      }
    },
    
    getFallbackPoems() {
      return [
        {
          id: 1,
          title: "静夜思",
          author: "李白",
          dynasty: "唐",
          category: "landscape",
          tags: ["思乡", "月亮", "夜晚"],
          content: ["床前明月光", "疑是地上霜", "举头望明月", "低头思故乡"]
        },
        {
          id: 2,
          title: "春晓",
          author: "孟浩然",
          dynasty: "唐",
          category: "landscape",
          tags: ["春天", "自然", "清晨"],
          content: ["春眠不觉晓", "处处闻啼鸟", "夜来风雨声", "花落知多少"]
        },
        {
          id: 3,
          title: "登鹳雀楼",
          author: "王之涣",
          dynasty: "唐",
          category: "landscape",
          tags: ["登高", "望远", "哲理"],
          content: ["白日依山尽", "黄河入海流", "欲穷千里目", "更上一层楼"]
        },
        {
          id: 4,
          title: "相思",
          author: "王维",
          dynasty: "唐",
          category: "love",
          tags: ["爱情", "思念", "红豆"],
          content: ["红豆生南国", "春来发几枝", "愿君多采撷", "此物最相思"]
        },
        {
          id: 5,
          title: "江雪",
          author: "柳宗元",
          dynasty: "唐",
          category: "landscape",
          tags: ["冬天", "孤独", "雪景"],
          content: ["千山鸟飞绝", "万径人踪灭", "孤舟蓑笠翁", "独钓寒江雪"]
        }
      ]
    },
    
    goToPage(page) {
      this.currentPage = page;
      window.scrollTo(0, 0);
    }
  }
}
</script>

<style scoped>
.poems-container {
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

.poems-main {
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.filters-section {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: 2px solid rgba(210, 180, 140, 0.3);
  border-radius: 25px;
  font-size: 1rem;
}

.search-btn {
  background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%);
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 25px;
  cursor: pointer;
}

.filter-options {
  display: flex;
  gap: 15px;
}

.filter-select {
  padding: 10px 15px;
  border: 2px solid rgba(210, 180, 140, 0.3);
  border-radius: 8px;
  background: white;
}

.poems-list {
  display: grid;
  gap: 20px;
}

.poem-item {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.poem-header {
  margin-bottom: 20px;
}

.poem-title {
  font-size: 1.5rem;
  color: #8B4513;
  font-family: '楷体', 'STKaiti', serif;
  margin-bottom: 10px;
}

.poem-meta {
  color: #666;
}

.poem-content {
  margin-bottom: 20px;
}

.poem-line {
  font-size: 1.1rem;
  color: #333;
  font-family: '楷体', 'STKaiti', serif;
  line-height: 1.8;
  text-align: center;
  margin: 5px 0;
}

.poem-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.poem-tags {
  display: flex;
  gap: 8px;
}

.tag {
  background: rgba(210, 180, 140, 0.2);
  color: #8B4513;
  padding: 4px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
}

.read-more {
  color: #8B4513;
  text-decoration: none;
  font-weight: bold;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 5px;
  cursor: pointer;
}

.page-btn.active {
  background: #8B4513;
  color: white;
}

@media (max-width: 768px) {
  .nav-menu {
    gap: 15px;
  }
  
  .filters-section {
    padding: 20px;
  }
  
  .filter-options {
    flex-direction: column;
  }
  
  .poem-footer {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
}
</style>